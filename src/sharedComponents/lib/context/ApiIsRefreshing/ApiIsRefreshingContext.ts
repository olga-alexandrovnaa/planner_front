import { createContext } from 'react';

export interface ApiIsRefreshingContextProps {
    ApiIsRefreshing?: boolean;
    setApiIsRefreshing?: (ApiIsRefreshing: boolean) => void;
}

export const ApiIsRefreshingContext = createContext<ApiIsRefreshingContextProps>({});
