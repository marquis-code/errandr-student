import { rewards_api } from "@/api_factory/modules/rewards";
import { ref } from 'vue';

export const useRewards = () => {
  const loading = ref(false);
  const leaders = ref<any[]>([]);
  const points = ref(0);
  const quests = ref<any[]>([]);

  const fetchLeaderboard = async (type: 'points' | 'orders' | 'deliveries' = 'points') => {
    loading.value = true;
    try {
      const res = await rewards_api.getLeaderboard(type);
      leaders.value = res.data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchMyPoints = async () => {
    try {
      const res = await rewards_api.getMyPoints();
      points.value = res.data?.points || 0;
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const fetchQuests = async () => {
    loading.value = true;
    try {
      const res = await rewards_api.getQuests();
      quests.value = res.data || [];
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    leaders,
    points,
    quests,
    fetchLeaderboard,
    fetchMyPoints,
    fetchQuests
  };
};
