import { exportData } from '@/utils/backup';

export const SettingsPanel = () => {
  return (
    <div>
      {/* Other settings... */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">Sao lưu dữ liệu</h3>
        <button
          onClick={exportData}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Tải xuống bản sao lưu
        </button>
      </div>
    </div>
  );
}; 