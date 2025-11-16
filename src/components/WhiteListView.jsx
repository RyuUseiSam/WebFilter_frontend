import React, { useState } from 'react';
import { Search, Plus, X, Trash2, Edit, Calendar, Clock, CheckCircle, XCircle, Power, List, FileText } from 'lucide-react';
import TimeSlotPicker from './TimeSlotPicker';
import ConfirmModal from './ConfirmModal';
import Pagination from './Pagination';

const WEEKDAYS = [
  { id: 1, label: '一' },
  { id: 2, label: '二' },
  { id: 3, label: '三' },
  { id: 4, label: '四' },
  { id: 5, label: '五' },
  { id: 6, label: '六' },
  { id: 0, label: '日' }
];

const WhiteListView = ({
  records,
  onAddRecord,
  onAddRecordBatch,
  onDeleteRecord,
  onToggleRecord,
  onUpdateTimeSlots,
  searchTerm,
  onSearchChange,
  paginationData,
  onPageChange,
  onPageSizeChange
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [inputMode, setInputMode] = useState('single'); // 'single' or 'batch'
  const [newUrl, setNewUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal state
  const [editingRecord, setEditingRecord] = useState(null);
  const [editTimeSlots, setEditTimeSlots] = useState([]);
  const [editIsScheduled, setEditIsScheduled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete confirmation modal state
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Format weekdays for display
  const formatWeekdays = (weekdayIds) => {
    return weekdayIds
      .map(id => WEEKDAYS.find(day => day.id === id)?.label)
      .join(',');
  };

  const handleCreateToggle = () => {
    if (!isCreating) {
      // Opening the form - copy search term to URL input if it exists
      if (searchTerm.trim()) {
        setNewUrl(searchTerm.trim());
      }
    } else {
      // Closing the form - reset everything
      setNewUrl('');
      setBatchUrls('');
      setInputMode('single');
      setIsScheduled(false);
      setTimeSlots([]);
    }
    setIsCreating(!isCreating);
  };

  const handleInputModeToggle = (mode) => {
    setInputMode(mode);
    // Clear the other input when switching modes
    if (mode === 'single') {
      setBatchUrls('');
    } else {
      setNewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (inputMode === 'single') {
        // Single URL submission
        if (newUrl.trim()) {
          // Validate URL format
          let urlToSubmit = newUrl.trim();

          // Ensure URL has protocol (required by backend)
          if (!urlToSubmit.startsWith('http://') && !urlToSubmit.startsWith('https://')) {
            urlToSubmit = 'https://' + urlToSubmit;
          }

          const newRecord = {
            url: urlToSubmit,
            type: 'white',
            isScheduled: isScheduled,
            scheduleTimeSlots: isScheduled ? timeSlots : [],
            isEnabled: true
          };
          await onAddRecord(newRecord);
          setNewUrl('');
          setIsScheduled(false);
          setTimeSlots([]);
          setIsCreating(false);
        }
      } else {
        // Batch URL submission
        if (batchUrls.trim()) {
          // Parse batch input - split by newline or comma
          const urls = batchUrls
            .split(/[\n,]+/)
            .map(url => url.trim())
            .filter(url => url.length > 0);

          if (urls.length === 0) {
            return;
          }

          // Process URLs and ensure they have protocol
          const processedUrls = urls.map(url => {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              return 'https://' + url;
            }
            return url;
          });

          // Create batch records
          const batchRecords = processedUrls.map(url => ({
            url: url,
            type: 'white',
            isScheduled: isScheduled,
            scheduleTimeSlots: isScheduled ? timeSlots : [],
            isEnabled: true
          }));

          await onAddRecordBatch(batchRecords);
          setBatchUrls('');
          setIsScheduled(false);
          setTimeSlots([]);
          setIsCreating(false);
        }
      }
    } catch (error) {
      console.error('Failed to add record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      await onDeleteRecord(recordToDelete.id);
      setShowDeleteModal(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  const handleToggleEnable = async (id) => {
    try {
      await onToggleRecord(id);
    } catch (error) {
      console.error('Failed to toggle record:', error);
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditIsScheduled(record.isScheduled);
    setEditTimeSlots(record.scheduleTimeSlots || []);
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
    setEditTimeSlots([]);
    setEditIsScheduled(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingRecord || isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdateTimeSlots(
        editingRecord.id,
        editIsScheduled ? editTimeSlots : [],
        editingRecord.isEnabled
      );
      handleEditCancel();
    } catch (error) {
      console.error('Failed to update record:', error);
    } finally {
      setIsUpdating(false);
    }
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg
                focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                transition-all duration-200 text-sm sm:text-base
                hover:border-gray-300"
            />
          </div>

          {/* Create Button */}
          <button
            type="button"
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
        {isCreating && (
          <div className="mt-6 animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
            {/* Input Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => handleInputModeToggle('single')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  inputMode === 'single'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                單筆輸入
              </button>
              <button
                type="button"
                onClick={() => handleInputModeToggle('batch')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  inputMode === 'batch'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                批次輸入
              </button>
            </div>

            {/* Single URL Input */}
            {inputMode === 'single' && (
              <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                  網址 (URL)
                </label>
                <input
                  id="url"
                  type="text"
                  placeholder="example.com 或 https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg
                    focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                    transition-all duration-200 text-sm sm:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示: 可輸入域名 (如 google.com) 或完整網址，系統會自動加上 https://
                </p>
              </div>
            )}

            {/* Batch URLs Input */}
            {inputMode === 'batch' && (
              <div className="space-y-2">
                <label htmlFor="batch-urls" className="block text-sm font-semibold text-gray-700">
                  批次網址 (Batch URLs)
                </label>
                <textarea
                  id="batch-urls"
                  placeholder="輸入多個網址，使用換行或逗號分隔&#10;例如:&#10;google.com&#10;facebook.com&#10;或&#10;google.com, facebook.com, youtube.com"
                  value={batchUrls}
                  onChange={(e) => setBatchUrls(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg
                    focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                    transition-all duration-200 text-sm sm:text-base resize-y"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示: 每行一個網址或使用逗號分隔，系統會自動加上 https://
                </p>
              </div>
            )}

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
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg
                font-semibold hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting
                ? (inputMode === 'batch' ? '批次新增中...' : '新增中...')
                : (inputMode === 'batch' ? '確認批次新增' : '確認新增')}
            </button>
          </form>
          </div>
        )}
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            白名單記錄
            <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              {paginationData.total} 筆
            </span>
          </h3>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {records.length === 0 ? (
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
                    狀態
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
                {records.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-green-50 transition-all duration-150 animate-fadeIn ${
                      !record.isEnabled ? 'opacity-50 bg-gray-50' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* URL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          record.isEnabled ? 'bg-green-500 animate-pulse-slow' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm font-medium break-all ${
                          record.isEnabled ? 'text-gray-900' : 'text-gray-500 line-through'
                        }`}>
                          {record.url}
                        </span>
                      </div>
                    </td>

                    {/* Enable/Disable Status */}
                    <td className="px-6 py-4 text-center">
                      {record.isEnabled ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          啟用
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                          <XCircle className="w-3 h-3" />
                          停用
                        </span>
                      )}
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
                          type="button"
                          onClick={() => handleToggleEnable(record.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            record.isEnabled
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                          title={record.isEnabled ? '停用' : '啟用'}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="編輯"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(record)}
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

        {/* Pagination */}
        <Pagination
          currentPage={paginationData.page}
          totalPages={paginationData.total_pages}
          pageSize={paginationData.page_size}
          total={paginationData.total}
          hasNext={paginationData.has_next}
          hasPrev={paginationData.has_prev}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          mode="whitelist"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="確認刪除"
        message={`確定要刪除白名單記錄「${recordToDelete?.url}」嗎？此操作無法復原。`}
        confirmText="確認刪除"
        cancelText="取消"
      />

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Edit className="w-6 h-6" />
                    編輯白名單記錄
                  </h3>
                  <p className="text-white/90 text-sm mt-1">{editingRecord.url}</p>
                </div>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Schedule Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-100">
                <input
                  id="edit-schedule"
                  type="checkbox"
                  checked={editIsScheduled}
                  onChange={(e) => setEditIsScheduled(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="edit-schedule" className="flex items-center gap-2 cursor-pointer select-none">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    排程白名單 (Schedule Whitelist)
                  </span>
                </label>
              </div>

              {/* Time Slot Picker */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  editIsScheduled ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {editIsScheduled && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <TimeSlotPicker timeSlots={editTimeSlots} onChange={setEditTimeSlots} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                    hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200
                    transition-all duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg
                    font-semibold hover:from-green-600 hover:to-emerald-700
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                    shadow-lg hover:shadow-xl
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isUpdating ? '更新中...' : '確認更新'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteListView;
