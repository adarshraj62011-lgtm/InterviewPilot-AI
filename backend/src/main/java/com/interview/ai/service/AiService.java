package com.interview.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.ai.entity.CandidateAnswer;
import com.interview.ai.entity.Interview;
import com.interview.ai.entity.Question;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class AiService {

    @Value("${app.openai.api-key}")
    private String openAiApiKey;

    @Value("${app.gemini.api-key}")
    private String geminiApiKey;

    @Value("${app.ai.preferred-provider}")
    private String preferredProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Question> generateQuestions(String domain, String difficulty, Interview interview) {
        String prompt = buildQuestionGenerationPrompt(domain, difficulty);
        String jsonResponse = null;

        // Try preferred provider
        if ("openai".equalsIgnoreCase(preferredProvider)) {
            jsonResponse = callOpenAi(prompt);
            if (jsonResponse == null) {
                log.warn("OpenAI question generation failed, trying Gemini fallback...");
                jsonResponse = callGemini(prompt);
            }
        } else {
            jsonResponse = callGemini(prompt);
            if (jsonResponse == null) {
                log.warn("Gemini question generation failed, trying OpenAI fallback...");
                jsonResponse = callOpenAi(prompt);
            }
        }

        // If both failed, use offline mock questions fallback
        if (jsonResponse == null) {
            log.warn("AI providers failed or credentials missing. Loading local offline mock questions.");
            return getOfflineMockQuestions(domain, difficulty, interview);
        }

        try {
            return parseQuestionsFromJson(jsonResponse, interview);
        } catch (Exception e) {
            log.error("Failed to parse AI response. Response content: {}. Error: {}", jsonResponse, e.getMessage());
            return getOfflineMockQuestions(domain, difficulty, interview);
        }
    }

    private String callOpenAi(String prompt) {
        if (openAiApiKey == null || openAiApiKey.isEmpty() || openAiApiKey.startsWith("YOUR_")) {
            return null;
        }
        try {
            String url = "https://api.openai.com/v1/chat/completions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("response_format", Map.of("type", "json_object"));

            Map<String, String> userMessage = Map.of("role", "user", "content", prompt);
            requestBody.put("messages", List.of(userMessage));
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("choices").get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            log.error("Error calling OpenAI API: {}", e.getMessage());
        }
        return null;
    }

    private String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.startsWith("YOUR_")) {
            return null;
        }
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> partContainer = Map.of("parts", List.of(textPart));
            Map<String, Object> contentContainer = Map.of("contents", List.of(partContainer));

            Map<String, Object> requestBody = new HashMap<>(contentContainer);
            requestBody.put("generationConfig", Map.of("responseMimeType", "application/json"));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            }
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
        }
        return null;
    }

    public String analyzeResume(String resumeText) {
        String prompt = "Analyze this resume and return one JSON object with fields: "
                + "skills (array of strings), experienceYears (integer), projects (array of concise project names), "
                + "and domainSuggestion (string). Return raw JSON only.\n\n"
                + resumeText;

        String response;
        if ("openai".equalsIgnoreCase(preferredProvider)) {
            response = callOpenAi(prompt);
            if (response == null) {
                response = callGemini(prompt);
            }
        } else {
            response = callGemini(prompt);
            if (response == null) {
                response = callOpenAi(prompt);
            }
        }

        return response != null
                ? response
                : "{\"skills\":[],\"experienceYears\":0,\"projects\":[],\"domainSuggestion\":\"General\"}";
    }

    private List<Question> parseQuestionsFromJson(String jsonString, Interview interview) throws Exception {
        JsonNode root = objectMapper.readTree(jsonString);
        JsonNode questionsNode = root.has("questions") ? root.get("questions") : root;

        List<Question> questions = new ArrayList<>();
        if (questionsNode.isArray()) {
            for (JsonNode qNode : questionsNode) {
                Question question = new Question();
                question.setInterview(interview);
                question.setQuestionText(qNode.path("questionText").asText());
                question.setQuestionType(qNode.path("questionType").asText().toUpperCase());
                question.setDifficulty(qNode.path("difficulty").asText().toUpperCase());
                question.setPoints(qNode.path("points").asInt(10));

                JsonNode optsNode = qNode.path("options");
                if (optsNode.isArray()) {
                    List<String> optionsList = new ArrayList<>();
                    for (JsonNode opt : optsNode) {
                        optionsList.add(opt.asText());
                    }
                    question.setOptions(objectMapper.writeValueAsString(optionsList));
                }

                question.setCorrectOption(qNode.path("correctOption").asText(null));
                questions.add(question);
            }
        }
        return questions;
    }

    private String buildQuestionGenerationPrompt(String domain, String difficulty) {
        return "You are an expert technical interviewer. Generate exactly 5 mock interview questions for the domain: " + domain +
                " and difficulty level: " + difficulty + ". The questions should contain: " +
                "2 Multiple Choice Questions (MCQ), 2 Subjective Questions, and 1 Coding Question. " +
                "Return the response STRICTLY as a JSON object containing a single key \"questions\", which holds the array of question objects. " +
                "Each question object in the array must strictly have these fields: " +
                "1. \"questionText\": The text of the question. For CODING type, provide a coding challenge statement. " +
                "2. \"questionType\": Must be exactly \"MCQ\", \"SUBJECTIVE\", or \"CODING\". " +
                "3. \"options\": A JSON array of exactly 4 strings for MCQ, or null for SUBJECTIVE and CODING. " +
                "4. \"correctOption\": For MCQ, it must match one of the options. For SUBJECTIVE, it should be a summary list of key concepts expected in a good answer. For CODING, it should be a description of the optimal logic or a reference solution. " +
                "5. \"difficulty\": Must be exactly \"" + difficulty.toUpperCase() + "\". " +
                "6. \"points\": Use 10. " +
                "Do not include any wrapper tags, backticks (e.g. ```json), or explanations. Return raw JSON.";
    }

    private List<Question> getOfflineMockQuestions(String domain, String difficulty, Interview interview) {
        List<Question> questions = new ArrayList<>();
        
        // Define mock questions based on domain
        if ("Java".equalsIgnoreCase(domain) || "Java Full Stack".equalsIgnoreCase(domain)) {
            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("Which of these statements is true about a static block in Java?")
                    .options("[\"It runs only when class is instantiated\", \"It runs when the class is loaded into memory\", \"It must return a value\", \"It is executed on every method call\"]")
                    .correctOption("It runs when the class is loaded into memory")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("Which class does not implement the Map interface in Java Collection framework?")
                    .options("[\"HashMap\", \"TreeMap\", \"Hashtable\", \"ArrayList\"]")
                    .correctOption("ArrayList")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("Explain the difference between '==' and the '.equals()' method in Java with respect to Object comparisons.")
                    .correctOption("== compares memory locations (references); .equals() compares actual content or value inside objects depending on implementation.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("What is the purpose of the 'volatile' keyword in multi-threaded Java applications?")
                    .correctOption("volatile guarantees visibility of changes to variables across threads; reads and writes go directly to main memory instead of thread caches.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("CODING")
                    .questionText("Write a Java method to check if a given string is a palindrome. Avoid using StringBuffer/StringBuilder reverse functions.")
                    .correctOption("Iterate from start and end towards the center, checking if characters at corresponding indices match.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());
        } else if ("DSA".equalsIgnoreCase(domain) || "Data Structures".equalsIgnoreCase(domain)) {
            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("What is the worst-case time complexity of searching in a Binary Search Tree (BST)?")
                    .options("[\"O(1)\", \"O(log N)\", \"O(N)\", \"O(N log N)\"]")
                    .correctOption("O(N)")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("Which data structure uses the LIFO (Last In First Out) principle?")
                    .options("[\"Queue\", \"Stack\", \"Binary Tree\", \"Linked List\"]")
                    .correctOption("Stack")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("Explain how the QuickSort algorithm works and detail its average and worst-case time complexities.")
                    .correctOption("Divide-and-conquer algorithm that selects a pivot, partitions elements around it, and recursively sorts sub-arrays. Average: O(N log N), Worst: O(N^2) when already sorted.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("Detail the primary differences between an Adjancency List and an Adjacency Matrix representation of graphs.")
                    .correctOption("Matrix: O(V^2) space, fast edge lookup O(1). List: O(V+E) space, efficient for sparse graphs, edge lookup O(degree of V).")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("CODING")
                    .questionText("Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum (Kadane's Algorithm).")
                    .correctOption("Keep a running sum of current subarray, reset to 0 if it goes negative, and maintain a maximum tracker.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());
        } else {
            // General Fallback questions (HR/General)
            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("What is the main goal of the Software Development Life Cycle (SDLC)?")
                    .options("[\"To write code as fast as possible\", \"To deliver high-quality software within budget and schedule\", \"To eliminate coding comments\", \"To replace developers with AI\"]")
                    .correctOption("To deliver high-quality software within budget and schedule")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("MCQ")
                    .questionText("Which method is best suited to describe a conflict resolution story in HR interviews?")
                    .options("[\"FLOW Method\", \"STAR Method\", \"FAST Method\", \"KPI Method\"]")
                    .correctOption("STAR Method")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("Describe the STAR methodology for answering behavioral or HR interview questions.")
                    .correctOption("STAR: Situation (describe background), Task (describe challenges), Action (what you did), Result (quantifiable outcome).")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("SUBJECTIVE")
                    .questionText("Explain the difference between monolithic architecture and microservices architecture.")
                    .correctOption("Monolith: Single codebase, single deployment unit. Microservices: Distributed services, independent databases and scaling, communicated over API.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());

            questions.add(Question.builder()
                    .interview(interview)
                    .questionType("CODING")
                    .questionText("Write a function to return the N-th Fibonacci number using an iterative approach (O(N) time and O(1) space complexity).")
                    .correctOption("Use variables to store last two values, iterate up to N updating variables in-place without recursion or array lists.")
                    .difficulty(difficulty)
                    .points(10)
                    .build());
        }

        return questions;
    }

    public Map<String, Object> evaluateAnswer(Question question, String submittedAnswer) {
        if ("MCQ".equalsIgnoreCase(question.getQuestionType())) {
            boolean correct = question.getCorrectOption() != null && 
                    question.getCorrectOption().trim().equalsIgnoreCase(submittedAnswer != null ? submittedAnswer.trim() : "");
            int score = correct ? 100 : 0;
            String feedback = correct ? "Correct! Excellent." : "Incorrect. The correct answer is: " + question.getCorrectOption();
            return Map.of("score", score, "feedback", feedback);
        }

        if (submittedAnswer == null || submittedAnswer.trim().isEmpty()) {
            return Map.of("score", 0, "feedback", "No answer was submitted.");
        }

        String prompt = "You are a senior technical interviewer grading a candidate's mock interview answer.\n" +
                "Question: " + question.getQuestionText() + "\n" +
                "Expected core points/references: " + question.getCorrectOption() + "\n" +
                "Candidate's Answer: " + submittedAnswer + "\n\n" +
                "Evaluate the answer. Return a JSON object with strictly these two fields:\n" +
                "1. \"score\": (int) A score out of 100 based on accuracy and technical depth.\n" +
                "2. \"feedback\": (string) A comprehensive review of strengths, weaknesses, and suggestions for improvement.\n" +
                "Return raw JSON only, no backticks or extra text.";

        String jsonResponse = null;
        if ("openai".equalsIgnoreCase(preferredProvider)) {
            jsonResponse = callOpenAi(prompt);
            if (jsonResponse == null) {
                jsonResponse = callGemini(prompt);
            }
        } else {
            jsonResponse = callGemini(prompt);
            if (jsonResponse == null) {
                jsonResponse = callOpenAi(prompt);
            }
        }

        if (jsonResponse != null) {
            try {
                JsonNode root = objectMapper.readTree(jsonResponse);
                int score = root.path("score").asInt(50);
                String feedback = root.path("feedback").asText("Satisfactory response.");
                return Map.of("score", score, "feedback", feedback);
            } catch (Exception e) {
                log.error("Failed to parse AI evaluation response: {}", e.getMessage());
            }
        }

        // Offline Fallback for Subjective/Coding evaluation
        int wordCount = submittedAnswer.split("\\s+").length;
        int score = Math.min(45 + wordCount * 2, 85); // simple heuristic score
        String feedback = "Answer received. [Offline Evaluation]: Good attempt, contains " + wordCount + " words. For high-fidelity grading, please check your AI API configurations.";
        return Map.of("score", score, "feedback", feedback);
    }

    public Map<String, String> evaluateOverallSession(List<Question> questions, List<CandidateAnswer> answers) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
            final Long qId = q.getId();
            com.interview.ai.entity.CandidateAnswer ans = answers.stream()
                    .filter(a -> a.getQuestion().getId().equals(qId))
                    .findFirst()
                    .orElse(null);
            
            sb.append("Question ").append(i + 1).append(": ").append(q.getQuestionText()).append("\n");
            sb.append("Candidate Answer: ").append(ans != null ? ans.getSubmittedAnswer() : "No answer submitted.").append("\n");
            sb.append("Score: ").append(ans != null ? ans.getScore() : 0).append("/100\n");
            sb.append("Feedback: ").append(ans != null ? ans.getFeedback() : "").append("\n\n");
        }

        String prompt = "You are a senior technical interviewer reviewing a candidate's completed mock interview session.\n" +
                "Here is the list of questions, answers, and scores:\n" + sb.toString() + "\n" +
                "Please generate an overall evaluation. Return a JSON object with strictly these four fields:\n" +
                "1. \"overallFeedback\": (string) A summary of candidate performance.\n" +
                "2. \"strengths\": (string) The candidate's main technical strengths.\n" +
                "3. \"weaknesses\": (string) Key weaknesses or areas needing attention.\n" +
                "4. \"suggestions\": (string) Concrete suggestions for how they can prepare or improve.\n" +
                "Return raw JSON only, no backticks.";

        String jsonResponse = null;
        if ("openai".equalsIgnoreCase(preferredProvider)) {
            jsonResponse = callOpenAi(prompt);
            if (jsonResponse == null) {
                jsonResponse = callGemini(prompt);
            }
        } else {
            jsonResponse = callGemini(prompt);
            if (jsonResponse == null) {
                jsonResponse = callOpenAi(prompt);
            }
        }

        if (jsonResponse != null) {
            try {
                JsonNode root = objectMapper.readTree(jsonResponse);
                return Map.of(
                        "overallFeedback", root.path("overallFeedback").asText("Completed mock interview."),
                        "strengths", root.path("strengths").asText("Demonstrated knowledge in key areas."),
                        "weaknesses", root.path("weaknesses").asText("Some concepts require refinement."),
                        "suggestions", root.path("suggestions").asText("Keep practicing questions and building projects.")
                );
            } catch (Exception e) {
                log.error("Failed to parse overall evaluation response: {}", e.getMessage());
            }
        }

        // Offline Heuristic Fallback
        return Map.of(
                "overallFeedback", "Completed mock interview session successfully.",
                "strengths", "Shows fundamental understanding of the requested domain topics.",
                "weaknesses", "Needs deeper experience with advanced optimization, code edge-cases, or structured explanations.",
                "suggestions", "Focus on structured problem solving, review conceptual definitions, and practice mock coding problems under time pressure."
        );
    }
}
