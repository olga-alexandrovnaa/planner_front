import { ApiIsRefreshingContext } from '@/sharedComponents/lib/context/ApiIsRefreshing/ApiIsRefreshingContext';
import { ReactNode, useMemo, useState } from 'react';

interface ApiIsRefreshingProviderProps {
  children?: ReactNode;
}

const ApiIsRefreshingProvider = (props: ApiIsRefreshingProviderProps) => {
  const {
    children,
  } = props;

  const { Provider } = (ApiIsRefreshingContext);

  const [ApiIsRefreshing, setApiIsRefreshing] = useState<boolean>(false);

  const defaultProps = useMemo(
    () => ({
      ApiIsRefreshing,
      setApiIsRefreshing,
    }),
    [ApiIsRefreshing],
);

  return (
    <Provider value={defaultProps}>
      {children}
    </Provider>
  );
};

export default ApiIsRefreshingProvider;