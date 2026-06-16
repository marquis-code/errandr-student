import { useCookie } from '#imports';

export const useDashboardMode = () => {
  // 'errands' for Food/Groceries/Deliveries, 'services' for Salon/Spa/Appointments
  const mode = useCookie<'errands' | 'services'>('errandr_dashboard_mode', { 
    default: () => 'errands',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  const toggleMode = () => {
    mode.value = mode.value === 'errands' ? 'services' : 'errands';
  };

  const setMode = (newMode: 'errands' | 'services') => {
    mode.value = newMode;
  };

  return {
    mode,
    toggleMode,
    setMode
  };
};
