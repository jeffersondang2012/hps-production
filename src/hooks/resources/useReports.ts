import { Report, BaseDocument } from '@/types/database.types';
import { reportService } from '@/services/core/report.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Timestamp, DocumentData } from 'firebase/firestore';

interface UseReportsOptions {
  type?: Report['type'];
  period?: Report['period'];
  dateRange?: [Date, Date];
  productionLineId?: string;
}

interface ReportData {
  revenue: number;
  expense: number;
  profit: number;
  transactionCount: number;
  expenseByType: Record<string, number>;
}

type ReportInput = Omit<Report, keyof BaseDocument>;

export const useReports = (options: UseReportsOptions = {}) => {
  const [reports, setReports] = useState<(Report & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const where: [string, any, any][] = [];

      if (options.type) {
        where.push(['type', '==', options.type]);
      }

      if (options.period) {
        where.push(['period', '==', options.period]);
      }

      if (options.dateRange) {
        const [startDate, endDate] = options.dateRange;
        where.push(['startDate', '>=', Timestamp.fromDate(startDate)]);
        where.push(['endDate', '<=', Timestamp.fromDate(endDate)]);
      }

      if (options.productionLineId) {
        where.push(['productionLineId', '==', options.productionLineId]);
      }

      const result = await reportService.getAll({ where });
      setReports(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách báo cáo');
    } finally {
      setIsLoading(false);
    }
  }, [options, showError]);

  const generateReport = useAsync(
    async (data: ReportInput) => {
      const now = Timestamp.now();
      const result = await reportService.create({
        ...data,
        createdAt: now,
        updatedAt: now
      } as unknown as Omit<Report, 'id'>);
      await fetchReports();
      return result;
    },
    {
      successMessage: 'Tạo báo cáo thành công',
      errorMessage: 'Lỗi khi tạo báo cáo',
      showNotification: true
    }
  );

  const exportReport = useAsync(
    async (id: string) => {
      const report = reports.find(r => r.id === id);
      if (!report) throw new Error('Không tìm thấy báo cáo');
      await reportService.exportToExcel(report.data as ReportData);
    },
    {
      successMessage: 'Xuất báo cáo thành công',
      errorMessage: 'Lỗi khi xuất báo cáo',
      showNotification: true
    }
  );

  return {
    reports,
    isLoading,
    error,
    generateReport: generateReport.execute,
    exportReport: exportReport.execute,
    refetch: fetchReports
  };
};

// Hook cho một báo cáo cụ thể
export const useReport = (id: string) => {
  const [report, setReport] = useState<(Report & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await reportService.getById(id);
      setReport(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin báo cáo');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  const updateReport = useAsync(
    async (data: Partial<Report>) => {
      await reportService.update(id, data);
      await fetchReport();
    },
    {
      successMessage: 'Cập nhật báo cáo thành công',
      errorMessage: 'Lỗi khi cập nhật báo cáo',
      showNotification: true
    }
  );

  const deleteReport = useAsync(
    async () => {
      await reportService.delete(id);
    },
    {
      successMessage: 'Xóa báo cáo thành công',
      errorMessage: 'Lỗi khi xóa báo cáo',
      showNotification: true
    }
  );

  return {
    report,
    isLoading,
    error,
    updateReport: updateReport.execute,
    deleteReport: deleteReport.execute,
    refetch: fetchReport
  };
}; 