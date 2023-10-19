import "./styles/index.scss";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { AppRouter } from "./providers/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAuthData,
  getUserInited,
  userActions,
} from "@/serviceEntities/User";
import { useCallback, useEffect } from "react";
import { getRoutelogin } from "@/sharedComponents/config/routeConfig/routeConfig";
import { useNavigate } from "react-router-dom";
import { useApiIsRefreshing } from "@/sharedComponents/lib/context/ApiIsRefreshing";
import { refresh } from "@/programFeatures/Auth";

const App = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const inited = useSelector(getUserInited);
  const authData = useSelector(getUserAuthData);

  useEffect(() => {
    dispatch(userActions.initAuthData());
  }, [dispatch]);

  const { ApiIsRefreshing, toggleApiIsRefreshing } = useApiIsRefreshing();
  const INTERVAL_MS = 50;

  const getHeaders = useCallback((): Headers => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + authData.token);
    return myHeaders;
  }, []);

  const addRetry = useCallback((): Headers => {
    const myHeaders = getHeaders();
    myHeaders.append("isRetry", "retry");
    return myHeaders;
  }, []);

  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      const [resource, config] = args;

      config.credentials = "include";

      if (!ApiIsRefreshing) {
        config.headers = getHeaders();
      } else {
        const interval = setInterval(() => {
          if (!ApiIsRefreshing) {
            clearInterval(interval);
            config.headers = getHeaders();
          }
        }, INTERVAL_MS);
      }

      const response = await originalFetch(resource, config);

      if (
        response.status === 401 &&
        response.headers.get("isRetry") !== "retry"
      ) {
        if (!ApiIsRefreshing) {
          toggleApiIsRefreshing(true);

          config.headers = addRetry();
          refresh();
          toggleApiIsRefreshing(false);
        }
        return await originalFetch(resource, config);
      }
      return response;
    };
  }, []);

  useEffect(() => {
    if (inited && !authData && location.pathname !== getRoutelogin()) {
      navigate(getRoutelogin(), { replace: true });
    }
  }, [inited, authData, location, navigate]);

  return (
    <div className={classNames("app")}>
      <AppRouter />
    </div>
  );
};

export default App;
