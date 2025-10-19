import React from 'react';
import WhiteListView from './WhiteListView';
import BlackListView from './BlackListView';

const DisplayView = ({ mode }) => {
  // Render WhiteListView for whitelist mode
  if (mode === 'whitelist') {
    return (
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <WhiteListView />
      </div>
    );
  }

  // Render BlackListView for blacklist mode
  return (
    <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
      <BlackListView />
    </div>
  );
};

export default DisplayView;
