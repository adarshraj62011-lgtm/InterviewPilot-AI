import React from 'react';
import ResumeUpload from '../components/ResumeUpload';

/**
 * Page wrapper for the resume upload UI. It is protected by the same route guard
 * as other candidate pages.
 */
export default function ResumePage() {
  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <ResumeUpload />
      </div>
    </div>
  );
}
