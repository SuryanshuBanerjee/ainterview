import React from 'react';
import Hero from '../components/Hero';
import ResumeBuilder from '../components/ResumeBuilder';
import InterviewCopilot from '../components/InterviewCopilot';
import CodingPilot from '../components/CodingPilot';
import PositionsTable from '../components/PositionsTable';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ResumeBuilder />
      <InterviewCopilot />
      <CodingPilot />
      <PositionsTable />
    </>
  );
}