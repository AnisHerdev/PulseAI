import RCMPage from '../components/rcm/RCMPage';
import { RefreshCcw } from 'lucide-react';

const RevenueCycle = () => {
  return <RCMPage />;
};

RevenueCycle.config = {
  id: 'rcm',
  label: 'Revenue Cycle',
  title: 'Revenue Cycle Management',
  icon: RefreshCcw,
  order: 3
};

export default RevenueCycle;
