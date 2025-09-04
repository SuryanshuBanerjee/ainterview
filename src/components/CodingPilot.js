import React from 'react';

const FeatureSection = ({ title, description }) => (
  <div className="pilot-feature-section">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const CodingPilot = () => {
  return (
    <section id="coding-pilot" className="coding-pilot-section">
      <div className="container">
        <div className="pilot-content">
          <div className="pilot-left">
            <div className="section-header">
              <p className="section-subtitle">Modern Interview Prep & Collaboration Tool</p>
              <h2 className="section-title">
                Interview Coding Pilot: <br />
                <span className="gradient-text">Your One-Click Coding Interview Solution</span>
              </h2>
              <p className="section-description">
                Accelerate your coding interview preparation with Interview Coding Pilot powered by Interview Prep AI. 
                Get instant, optimized solutions for real-world coding challenges and boost your confidence for top tech roles.
              </p>
            </div>
            
            <div className="pilot-features">
              <FeatureSection
                title="Revolutionize Your Coding Interview Prep"
                description="With a single click, choose your programming language or framework and let Interview Prep AI generate optimized solutions for coding challenges. Whether you're practicing algorithms, data structures, or framework-specific problems, get comprehensive answers tailored to your needs."
              />
              
              <FeatureSection
                title="AI-Driven Analytics & Collaboration"
                description="Our advanced AI-powered analytics not only pinpoint your areas for improvement but also offer collaborative features. Practice with peers or mentors, and let the tool refine your answers for coding interview excellence."
              />
            </div>
          </div>
          
          <div className="pilot-right">
            <div className="code-editor-mockup">
              <div className="editor-header">
                <div className="editor-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <div className="editor-title">interview-prep.js</div>
              </div>
              
              <div className="editor-content">
                <div className="line-numbers">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                  <span>13</span>
                  <span>14</span>
                  <span>15</span>
                </div>
                
                <div className="code-text">
                  <div className="code-line"><span className="keyword">function</span> <span className="function">twoSum</span>(<span className="param">nums, target</span>) &#123;</div>
                  <div className="code-line">  <span className="keyword">const</span> <span className="variable">map</span> = <span className="keyword">new</span> <span className="class">Map</span>();</div>
                  <div className="code-line"></div>
                  <div className="code-line">  <span className="keyword">for</span> (<span className="keyword">let</span> <span className="variable">i</span> = <span className="number">0</span>; <span className="variable">i</span> &lt; <span className="variable">nums</span>.<span className="property">length</span>; <span className="variable">i</span>++) &#123;</div>
                  <div className="code-line">    <span className="keyword">const</span> <span className="variable">complement</span> = <span className="variable">target</span> - <span className="variable">nums</span>[<span className="variable">i</span>];</div>
                  <div className="code-line"></div>
                  <div className="code-line">    <span className="keyword">if</span> (<span className="variable">map</span>.<span className="method">has</span>(<span className="variable">complement</span>)) &#123;</div>
                  <div className="code-line">      <span className="keyword">return</span> [<span className="variable">map</span>.<span className="method">get</span>(<span className="variable">complement</span>), <span className="variable">i</span>];</div>
                  <div className="code-line">    &#125;</div>
                  <div className="code-line"></div>
                  <div className="code-line">    <span className="variable">map</span>.<span className="method">set</span>(<span className="variable">nums</span>[<span className="variable">i</span>], <span className="variable">i</span>);</div>
                  <div className="code-line">  &#125;</div>
                  <div className="code-line"></div>
                  <div className="code-line">  <span className="keyword">return</span> [];</div>
                  <div className="code-line">&#125;</div>
                </div>
              </div>
              
              <div className="editor-footer">
                <div className="status-bar">
                  <span className="status-item">JavaScript</span>
                  <span className="status-item">UTF-8</span>
                  <span className="status-item">Ln 15, Col 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingPilot;