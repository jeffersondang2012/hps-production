import { FC, useEffect } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Partner } from '@/types/database.types';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { env } from '@/config/env';
import { Icon } from '@/components/atoms/Icon';

const schema = z.object({
  name: z.string().min(1, 'Tên đối tác là bắt buộc'),
  type: z.enum(['SUPPLIER', 'CUSTOMER', 'BOTH']),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  debtLimit: z.number().min(0, 'Hạn mức công nợ phải lớn hơn hoặc bằng 0'),
  notificationChannels: z.object({
    zalo: z.string().nullable(),
    telegram: z.string().nullable()
  }),
  notificationPreference: z.enum(['NONE', 'ZALO', 'TELEGRAM', 'BOTH']),
  zaloId: z.string().nullable(),
  telegramChatId: z.string().nullable(),
  zaloPhone: z.string().nullable()
});

type FormData = z.infer<typeof schema>;

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Partner | null;
}

export const PartnerModal: FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'SUPPLIER',
      phone: '',
      address: '',
      debtLimit: 0,
      notificationChannels: {
        zalo: null,
        telegram: null
      },
      notificationPreference: 'NONE',
      zaloId: null,
      telegramChatId: null,
      zaloPhone: null
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        type: initialData.type,
        phone: initialData.phone,
        address: initialData.address,
        debtLimit: initialData.debtLimit,
        notificationChannels: {
          zalo: initialData.notificationChannels?.zalo || null,
          telegram: initialData.notificationChannels?.telegram || null
        },
        notificationPreference: initialData.notificationPreference || 'NONE',
        zaloId: initialData.zaloId || null,
        telegramChatId: initialData.telegramChatId || null,
        zaloPhone: initialData.zaloPhone || null
      });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConnectZalo = () => {
    const redirectUri = `${window.location.origin}/connect-zalo`;
    const url = `https://oauth.zaloapp.com/v4/permission?app_id=${env.zalo.oaId}&redirect_uri=${redirectUri}&state=${initialData.id}`;
    window.open(url, '_blank');
  };

  const handleConnectTelegram = () => {
    if (!initialData?.id) return;
    
    // Mã hóa partnerId
    const encodedId = btoa(initialData.id);
    // Sử dụng https://t.me thay vì tg://
    window.open(`https://t.me/Catnghien_bot?start=${encodedId}`, '_blank');
  };

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Cập nhật đối tác' : 'Thêm đối tác'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            label="Tên đối tác"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div>
          <Select
            label="Loại đối tác"
            {...register('type')}
            error={errors.type?.message}
          >
            <option value="SUPPLIER">Nhà cung cấp</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="BOTH">Cả hai</option>
          </Select>
        </div>

        <div>
          <Input
            label="Số điện thoại"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div>
          <Input
            label="Địa chỉ"
            {...register('address')}
            error={errors.address?.message}
          />
        </div>

        <div>
          <Input
            type="number"
            label="Hạn mức công nợ"
            {...register('debtLimit', { valueAsNumber: true })}
            error={errors.debtLimit?.message}
          />
        </div>

        <div>
          <Select
            label="Nhận thông báo"
            {...register('notificationPreference')}
          >
            <option value="NONE">Không nhận thông báo</option>
            <option value="TELEGRAM">Telegram</option>
          </Select>
        </div>

        {watch('notificationPreference') === 'TELEGRAM' && (
          <div className="flex items-center space-x-2">
            <Input
              label="Telegram Chat ID"
              {...register('telegramChatId')}
              readOnly
              placeholder="Chưa kết nối"
            />
            <Button
              type="button"
              onClick={handleConnectTelegram}
              variant="outline"
              startIcon={<Icon name="ChatBubbleLeftIcon" className="w-5 h-5" />}
            >
              Kết nối Telegram
            </Button>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 