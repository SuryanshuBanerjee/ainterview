import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResumeBuilder from './components/ResumeBuilder';
import InterviewCopilot from './components/InterviewCopilot';
import CodingPilot from './components/CodingPilot';
import ChatPreview from './components/ChatPreview';
import PositionsTable from './components/PositionsTable';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <ResumeBuilder />
        <InterviewCopilot />
        <CodingPilot />
        <ChatPreview />
        <PositionsTable />
      </main>
    </div>
  );
}

export default App;