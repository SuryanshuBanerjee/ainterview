import React from 'react';

const Message = ({ type, label, time, content, actions = [] }) => (
  <div className={`message ${type}`}>
    {label && <div className="message-label">{label}</div>}
    {time && <div className="message-time">{time}</div>}
    <div className="message-content">{content}</div>
    {actions.length > 0 && (
      <div className="message-actions">
        {actions.map((action, index) => (
          <button key={index} className="action-btn">{action}</button>
        ))}
      </div>
    )}
  </div>
);

const ChatPreview = () => {
  const messages = [
    {
      type: 'user',
      content: `Hey, Hi good afternoon, and thank you for joining us today! And, I'm excited for our brief introduction. Could you please take me through your background and tell me a bit about your experience and background in web development?`
    },
    {
      type: 'assistant',
      label: 'Answer 2',
      time: '11:52 AM',
      content: `Thank you for having me. While my primary expertise lies in data science and machine learning, I have gained valuable experience working on full-stack applications that required integrating data-driven solutions into web-based platforms, which gave me exposure to some fundamental web development concepts.

I developed interactive dashboards using tools like AWS QuickSight and Tableau to present predictive model outcomes. These dashboards were essentially web applications that enabled business users to interact with our machine learning models, giving me insights in real-time, making it easier for them to make informed decisions.`,
      actions: ['💡', '📋']
    }
  ];

  return (
    <section className="chat-preview">
      <div className="container">
        <div className="chat-window">
          <div className="chat-header">
            <span>AI Interview Assistant</span>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;