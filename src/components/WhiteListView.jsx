import React, { useState } from 'react';
import { Search, Plus, X, Trash2, Edit, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import TimeSlotPicker from './TimeSlotPicker';

// Mock data for demonstration
const mockWhiteListData = [
  {
    id: 1,
    url: 'https://www.google.com',
    isScheduled: false,
    scheduleTimeSlots: []
  },
  {
    id: 2,
    url: 'https://github.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '09:00', end: '12:00', weekdays: [1, 2, 3, 4, 5] },
      { start: '13:00', end: '18:00', weekdays: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 3,
    url: 'https://stackoverflow.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '08:00', end: '17:00', weekdays: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 4,
    url: 'https://developer.mozilla.org',
    isScheduled: false,
    scheduleTimeSlots: []
  },
  {
    id: 5,
    url: 'https://www.youtube.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '12:00', end: '13:00', weekdays: [1, 2, 3, 4, 5] },
      { start: '18:00', end: '20:00', weekdays: [6, 0] },
      { start: '21:00', end: '22:00', weekdays: [0] }
    ]
  },
  {
    id: 6,
    url: 'https://www.wikipedia.org',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '00:00', end: '23:59', weekdays: [0, 1, 2, 3, 4, 5, 6] }
    ]
  }
];

const WEEKDAYS = [
  { id: 1, label: '一' },
  { id: 2, label: '二' },
  { id: 3, label: '三' },
  { id: 4, label: '四' },
  { id: 5, label: '五' },
  { id: 6, label: '六' },
  { id: 0, label: '日' }
];

const WhiteListView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [records, setRecords] = useState(mockWhiteListData);

  // Format weekdays for display
  const formatWeekdays = (weekdayIds) => {
    return weekdayIds
      .map(id => WEEKDAYS.find(day => day.id === id)?.label)
      .join(',');
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record =>
    record.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateToggle = () => {
    setIsCreating(!isCreating);
    if (isCreating) {
      // Reset form when closing
      setNewUrl('');
      setIsScheduled(false);
      setTimeSlots([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUrl.trim()) {
      const newRecord = {
        id: records.length + 1,
        url: newUrl.trim(),
        isScheduled: isScheduled,
        scheduleTimeSlots: isScheduled ? timeSlots : []
      };
      setRecords([...records, newRecord]);
      setNewUrl('');
      setIsScheduled(false);
      setTimeSlots([]);
      setIsCreating(false);
    }
  };

  const handleDelete = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Search and Create Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋 URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg
                focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                transition-all duration-200 text-sm sm:text-base
                hover:border-gray-300"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateToggle}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
              transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md
              ${isCreating
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
          >
            {isCreating ? (
              <>
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">取消</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">新增記錄</span>
                <span className="sm:hidden">新增</span>
              </>
            )}
          </button>
        </div>

        {/* Expandable Create Form */}
        <div
          className={`overflow-visible transition-all duration-300 ease-in-out ${
            isCreating ? 'max-h-[1200px] mt-6 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
            {/* URL Input */}
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                網址 (URL)
              </label>
              <input
                id="url"
                type="text"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                  transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            {/* Schedule Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-100">
              <input
                id="schedule"
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="schedule" className="flex items-center gap-2 cursor-pointer select-none">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  排程白名單 (Schedule Whitelist)
                </span>
              </label>
            </div>

            {/* Time Slot Picker - Only shown when scheduled */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isScheduled ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {isScheduled && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                  <TimeSlotPicker timeSlots={timeSlots} onChange={setTimeSlots} />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg
                font-semibold hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl"
            >
              確認新增
            </button>
          </form>
        </div>
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            白名單記錄
            <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              {filteredRecords.length} 筆
            </span>
          </h3>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">
                {searchTerm ? '找不到符合的記錄' : '尚無白名單記錄'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    網址 (URL)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    排程狀態
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    時間區間 (Time Slots)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="hover:bg-green-50 transition-colors duration-150 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* URL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
                        <span className="text-sm text-gray-900 font-medium break-all">
                          {record.url}
                        </span>
                      </div>
                    </td>

                    {/* Is Scheduled */}
                    <td className="px-6 py-4 text-center">
                      {record.isScheduled ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          <Calendar className="w-3 h-3" />
                          已排程
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          <XCircle className="w-3 h-3" />
                          未排程
                        </span>
                      )}
                    </td>

                    {/* Schedule Time Slots */}
                    <td className="px-6 py-4">
                      {record.scheduleTimeSlots && record.scheduleTimeSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {record.scheduleTimeSlots.map((slot, idx) => (
                            <div
                              key={idx}
                              className="inline-flex flex-col gap-1 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-blue-100 hover:shadow-sm"
                            >
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{slot.start} - {slot.end}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">週{formatWeekdays(slot.weekdays)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-sm text-gray-400">-</span>
                        </div>
                      )}
                    </td>

                    {/* Operations */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="編輯"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="刪除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteListView;
