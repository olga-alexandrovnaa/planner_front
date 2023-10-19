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

  const addBearer = useCallback((config: RequestInit) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + authData.token);

    config.headers = myHeaders;
  }, []);

  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      const [resource, config] = args;

      if (!ApiIsRefreshing) {
        addBearer(config);
      } else {
        const interval = setInterval(() => {
          if (!ApiIsRefreshing) {
            clearInterval(interval);
            addBearer(config);
          }
        }, INTERVAL_MS);
      }

      const response = await originalFetch(resource, config);

      if (response.status === 401) {
        //&& error.config && !error.config._isRetry) {
        if (!ApiIsRefreshing) {
          toggleApiIsRefreshing(true);
          // originalRequest._isRetry = true;
          // await UserStore.refresh();
          toggleApiIsRefreshing(false);
        }
        // return $api.request(originalRequest);
      }

      const json = () =>
        response
          .clone()
          .json()
          .then((data) => ({ ...data, title: `Intercepted: ${data.title}` }));
      response.json = json;

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
