import { useState, useEffect } from 'react';
import { Partner } from '@/types/database.types';
import { NotificationChannel, NotificationSetting, SystemNotificationType } from '@/types/notification.types';
import { settingService } from '@/services/notification/setting.service';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Timestamp } from 'firebase/firestore';

interface NotificationSettingsProps {
  partner: Partner;
}

export const NotificationSettings = ({ partner }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  // Các kênh thông báo có sẵn
  const availableChannels: NotificationChannel[] = ['ZALO', 'TELEGRAM', 'EMAIL'];

  // Các loại thông báo có sẵn
  const availableTypes: SystemNotificationType[] = [
    'TRANSACTION_CREATED',
    'TRANSACTION_UPDATED',
    'PAYMENT_RECEIVED',
    'PAYMENT_SENT',
    'DEBT_REMINDER',
    'DEBT_OVERDUE'
  ];

  // Lấy cấu hình hiện tại
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await settingService.getByPartner(partner.id);
        if (data) {
          setSettings(data);
        } else {
          const now = Timestamp.now();
          setSettings({
            id: '', // ID sẽ được tạo bởi Firestore
            partnerId: partner.id,
            partnerType: partner.type,
            channels: [],
            enabledTypes: [],
            contacts: {},
            createdAt: now,
            updatedAt: now
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [partner.id, partner.type]);

  // Lưu cấu hình
  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);

      if (settings.id) {
        await settingService.update(settings.id, {
          channels: settings.channels,
          enabledTypes: settings.enabledTypes,
          contacts: settings.contacts
        });
      } else {
        const { id, ...data } = settings;
        await settingService.create(data);
      }

      showSuccess('Lưu cấu hình thành công');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lưu cấu hình thất bại';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật kênh thông báo
  const handleChannelChange = (channel: NotificationChannel) => {
    if (!settings) return;

    const channels = settings.channels.includes(channel)
      ? settings.channels.filter(c => c !== channel)
      : [...settings.channels, channel];

    setSettings({
      ...settings,
      channels
    });
  };

  // Cập nhật loại thông báo
  const handleTypeChange = (type: SystemNotificationType) => {
    if (!settings) return;

    const enabledTypes = settings.enabledTypes.includes(type)
      ? settings.enabledTypes.filter(t => t !== type)
      : [...settings.enabledTypes, type];

    setSettings({
      ...settings,
      enabledTypes
    });
  };

  // Cập nhật thông tin liên hệ
  const handleContactChange = (channel: NotificationChannel, value: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      contacts: {
        ...settings.contacts,
        [channel.toLowerCase()]: value
      }
    });
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Kênh thông báo</h3>
        <div className="mt-4 space-y-4">
          {availableChannels.map(channel => (
            <div key={channel} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`channel-${channel}`}
                  type="checkbox"
                  checked={settings?.channels.includes(channel)}
                  onChange={() => handleChannelChange(channel)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={`channel-${channel}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {channel}
                </label>
                {settings?.channels.includes(channel) && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={settings.contacts[channel.toLowerCase() as keyof typeof settings.contacts] || ''}
                      onChange={(e) => handleContactChange(channel, e.target.value)}
                      placeholder={`Nhập ${channel.toLowerCase()}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Loại thông báo</h3>
        <div className="mt-4 space-y-4">
          {availableTypes.map(type => (
            <div key={type} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`type-${type}`}
                  type="checkbox"
                  checked={settings?.enabledTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {type.replace(/_/g, ' ')}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !settings}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </div>
    </div>
  );
}; 