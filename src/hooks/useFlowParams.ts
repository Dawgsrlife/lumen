import { useSearchParams } from 'react-router-dom';

export const useFlowParams = () => {
  const [searchParams] = useSearchParams();
  const isManualFlow = searchParams.get('manual') === 'true';
  
  return { isManualFlow };
}; 