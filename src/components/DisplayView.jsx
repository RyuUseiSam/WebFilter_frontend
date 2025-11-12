import React from 'react';
import WhiteListView from './WhiteListView';
import BlackListView from './BlackListView';

const DisplayView = ({
  mode,
  whiteListRecords,
  blackListRecords,
  onAddRecord,
  onDeleteRecord,
  onToggleRecord,
  onUpdateTimeSlots,
}) => {
  // Render WhiteListView for whitelist mode
  if (mode === 'whitelist') {
    return (
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <WhiteListView
          records={whiteListRecords}
          onAddRecord={onAddRecord}
          onDeleteRecord={onDeleteRecord}
          onToggleRecord={onToggleRecord}
          onUpdateTimeSlots={onUpdateTimeSlots}
        />
      </div>
    );
  }

  // Render BlackListView for blacklist mode
  return (
    <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
      <BlackListView
        records={blackListRecords}
        onAddRecord={onAddRecord}
        onDeleteRecord={onDeleteRecord}
        onToggleRecord={onToggleRecord}
        onUpdateTimeSlots={onUpdateTimeSlots}
      />
    </div>
  );
};

export default DisplayView;
