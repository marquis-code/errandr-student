import { ref } from 'vue';
import { reports_api } from '@/api_factory/modules/reports';

export const useReports = () => {
  const loading = ref(false);
  const reports = ref<any[]>([]);
  const report = ref<any>(null);

  const fetchMyReports = async () => {
    loading.value = true;
    try {
      const res = await reports_api.getMine();
      reports.value = res.data || [];
    } catch (e) {
      console.error('Failed to fetch reports', e);
    } finally {
      loading.value = false;
    }
  };

  const fetchReport = async (id: string) => {
    loading.value = true;
    try {
      const res = await reports_api.getById(id);
      report.value = res.data;
      return res.data;
    } catch (e) {
      console.error('Failed to fetch report', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const submitReport = async (payload: any) => {
    loading.value = true;
    try {
      const res = await reports_api.create(payload);
      return res.data;
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = async (reportId: string, message: string) => {
    try {
      const res = await reports_api.addMessage(reportId, message);
      report.value = res.data;
      return res.data;
    } catch (e) {
      console.error('Failed to send message', e);
      return null;
    }
  };

  return {
    loading,
    reports,
    report,
    fetchMyReports,
    fetchReport,
    submitReport,
    sendMessage,
  };
};
