import React, { useState } from 'react';

const Tab = ({ children, active, onClick }) => (
  <button 
    className={`tab ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const PositionsTable = () => {
  const [activeTab, setActiveTab] = useState('position');
  
  const tabs = [
    { id: 'position', label: 'Position' },
    { id: 'company', label: 'Company' },
    { id: 'detail', label: 'Company Detail' },
    { id: 'description', label: 'Job Description' }
  ];

  return (
    <section className="positions-table">
      <div className="container">
        <div className="table-header">
          <div className="table-tabs">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </div>
          <button className="launch-btn">Launch</button>
        </div>
      </div>
    </section>
  );
};

export default PositionsTable;