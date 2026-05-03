import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const meal_planner_api = {
  generatePlan: (params: { budget: number; mealsPerDay: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/meal-planner', { params });
  },
};
