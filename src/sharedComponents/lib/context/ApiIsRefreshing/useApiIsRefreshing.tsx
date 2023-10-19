import { useContext } from "react";
import { ApiIsRefreshingContext } from "./ApiIsRefreshingContext";

interface UseThemeResult {
  toggleApiIsRefreshing: (newTheme: boolean) => void;
  ApiIsRefreshing: boolean;
}

const useApiIsRefreshing = (): UseThemeResult => {
  const { ApiIsRefreshing, setApiIsRefreshing } = useContext(ApiIsRefreshingContext);

  const toggleApiIsRefreshing= (newTheme: boolean) => {
    setApiIsRefreshing?.(newTheme);
  };

  return {
      ApiIsRefreshing: ApiIsRefreshing,
      toggleApiIsRefreshing,
  };
};

export default useApiIsRefreshing;



