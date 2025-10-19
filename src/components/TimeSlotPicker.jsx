import React, { useState } from 'react';
import { Plus, Trash2, Clock, ArrowRight, Check, Calendar } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const WEEKDAYS = [
  { id: 1, label: '一', name: 'Monday', short: 'Mon' },
  { id: 2, label: '二', name: 'Tuesday', short: 'Tue' },
  { id: 3, label: '三', name: 'Wednesday', short: 'Wed' },
  { id: 4, label: '四', name: 'Thursday', short: 'Thu' },
  { id: 5, label: '五', name: 'Friday', short: 'Fri' },
  { id: 6, label: '六', name: 'Saturday', short: 'Sat' },
  { id: 0, label: '日', name: 'Sunday', short: 'Sun' }
];

const TimeSlotPicker = ({ timeSlots, onChange }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedWeekdays, setSelectedWeekdays] = useState([]); // Default: None
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [pendingSlot, setPendingSlot] = useState(null);
  const [overlappingSlots, setOverlappingSlots] = useState([]);

  // Toggle weekday selection
  const toggleWeekday = (dayId) => {
    setSelectedWeekdays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId].sort()
    );
  };

  // Convert time string to minutes for comparison
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Check if two time ranges overlap
  // Only considers overlap if BOTH weekdays AND time ranges overlap
  // Same time on different weekdays = NOT overlapping
  const isOverlapping = (slot1, slot2) => {
    // Check if they share any weekdays
    const sharedWeekdays = slot1.weekdays.filter(day => slot2.weekdays.includes(day));
    if (sharedWeekdays.length === 0) {
      // Different weekdays = NOT overlapping (separate time slots)
      return false;
    }

    // Check if time ranges overlap (only if weekdays overlap)
    const start1 = timeToMinutes(slot1.start);
    const end1 = timeToMinutes(slot1.end);
    const start2 = timeToMinutes(slot2.start);
    const end2 = timeToMinutes(slot2.end);

    return start1 < end2 && start2 < end1;
  };

  // Merge overlapping time slots
  const mergeSlots = (slot1, slot2) => {
    const start1 = timeToMinutes(slot1.start);
    const end1 = timeToMinutes(slot1.end);
    const start2 = timeToMinutes(slot2.start);
    const end2 = timeToMinutes(slot2.end);

    const mergedStart = Math.min(start1, start2);
    const mergedEnd = Math.max(end1, end2);

    const formatTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // Merge weekdays (union)
    const mergedWeekdays = [...new Set([...slot1.weekdays, ...slot2.weekdays])].sort();

    return {
      start: formatTime(mergedStart),
      end: formatTime(mergedEnd),
      weekdays: mergedWeekdays
    };
  };

  // Add the current time slot to the list
  const handleAddSlot = () => {
    if (selectedWeekdays.length === 0) {
      alert('請至少選擇一個星期');
      return;
    }

    const newSlot = {
      start: startTime,
      end: endTime,
      weekdays: selectedWeekdays
    };

    // Check for overlaps
    const overlaps = timeSlots.filter(slot => isOverlapping(newSlot, slot));

    if (overlaps.length > 0) {
      // Show merge confirmation modal
      setPendingSlot(newSlot);
      setOverlappingSlots(overlaps);
      setShowMergeModal(true);
    } else {
      // No overlaps, add directly
      addSlotDirectly(newSlot);
    }
  };

  // Add slot without checking overlaps
  const addSlotDirectly = (slot) => {
    onChange([...timeSlots, slot]);
    resetForm();
  };

  // Handle merge confirmation
  const handleMergeConfirm = () => {
    let newSlots = [...timeSlots];
    let mergedSlot = pendingSlot;

    // Merge with all overlapping slots
    overlappingSlots.forEach(overlapSlot => {
      mergedSlot = mergeSlots(mergedSlot, overlapSlot);
      // Remove the overlapping slot
      newSlots = newSlots.filter(slot => slot !== overlapSlot);
    });

    // Add the merged slot
    newSlots.push(mergedSlot);
    onChange(newSlots);

    setShowMergeModal(false);
    setPendingSlot(null);
    setOverlappingSlots([]);
    resetForm();
  };

  // Handle merge cancellation - add without merging
  const handleMergeCancel = () => {
    setShowMergeModal(false);
    setPendingSlot(null);
    setOverlappingSlots([]);
  };

  // Reset form to defaults
  const resetForm = () => {
    setStartTime('09:00');
    setEndTime('17:00');
    setSelectedWeekdays([]);
  };

  // Remove a time slot from the list
  const handleRemoveSlot = (index) => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    onChange(newSlots);
  };

  // Apply quick preset
  const applyPreset = (start, end) => {
    setStartTime(start);
    setEndTime(end);
  };

  // Format weekdays for display
  const formatWeekdays = (weekdayIds) => {
    return weekdayIds
      .map(id => WEEKDAYS.find(day => day.id === id)?.label)
      .join(', ');
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">時間區間設定</span>
        </div>

        {/* Single Time Slot Input */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
          {/* Weekday Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              星期選擇
            </label>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleWeekday(day.id)}
                  className={`p-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    selectedWeekdays.includes(day.id)
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              開始時間
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg
                focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                transition-all duration-200 text-base font-medium text-gray-700
                hover:border-gray-300"
              style={{ colorScheme: 'light' }}
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              結束時間
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg
                focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                transition-all duration-200 text-base font-medium text-gray-700
                hover:border-gray-300"
              style={{ colorScheme: 'light' }}
            />
          </div>

          {/* Quick Time Presets */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">快速設定</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('08:25', '09:05')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第一節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('09:10', '09:50')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第二節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('10:25', '10:55')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第三節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('11:00', '11:40')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第四節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('11:50', '12:30')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第五節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('14:10', '14:50')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第六節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('15:00', '15:40')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第七節
              </button>
              <button
                type="button"
                onClick={() => applyPreset('15:50', '16:30')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                第八節
              </button>
            </div>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddSlot}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5
              bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg
              font-semibold hover:from-blue-600 hover:to-indigo-700
              focus:outline-none focus:ring-4 focus:ring-blue-300
              transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
              shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            新增時段
          </button>
        </div>

        {/* Preview Section */}
        {timeSlots.length > 0 && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                預覽時段
              </p>
              <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded-full font-medium">
                {timeSlots.length} 個時段
              </span>
            </div>
            <div className="space-y-2">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 bg-white border-2 border-blue-300 rounded-lg hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span>{slot.start} - {slot.end}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>週{formatWeekdays(slot.weekdays)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="刪除時段"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Merge Confirmation Modal */}
      <ConfirmModal
        isOpen={showMergeModal}
        onClose={handleMergeCancel}
        onConfirm={handleMergeConfirm}
        title="發現重疊時段"
        message={`新時段與現有時段存在重疊。是否合併這些時段？合併後將建立一個包含所有重疊時間的新時段。`}
        confirmText="合併時段"
        cancelText="取消"
      />
    </>
  );
};

export default TimeSlotPicker;
