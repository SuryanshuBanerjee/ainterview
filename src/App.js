import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChatPreview from './components/ChatPreview';
import PositionsTable from './components/PositionsTable';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <ChatPreview />
        <PositionsTable />
      </main>
    </div>
  );
}

export default App;