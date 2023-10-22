import { resolve } from "path";
import { USER_LOCALSTORAGE_KEY } from "../const/localstorage";
import getHeaders from "./getHeaders";
import localstorageAuthData from "./localstorageAuthData";
import refresh from "./refresh";

let isRefreshing = false;
const INTERVAL_MS = 50;

const { fetch: originalFetch } = window;

const $api = async (
  ...args: [input: RequestInfo | URL, init?: RequestInit]
) => {
  const [resource, config] = args;

   // Получить юзера и token из localStorage
  const authData = localstorageAuthData();

  // Настроить config
  config.credentials = "include";
  config.headers = getHeaders(authData?.accessToken);

  // Отправить запрос
  const response = await originalFetch(resource, config);

  // Если не авторизовано и не повторный
  if (response.status === 401) {
    if( !("_isRetry" in config) && authData) {
      Object.assign(config, { _isRetry: true });
      //Если refresh токен не обновляется - обновить
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await refresh();
          //записать новый accessToken
          authData.accessToken = response.accessToken;
          localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(authData));
          isRefreshing = false;
          return $api(resource, config);
        } catch (e) {
          isRefreshing = false;
          throw new Error();
        }
      } else {
          // Продолжить если refresh токен не обновляется
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(interval);
                resolve($api(resource, config));
              }
            }, INTERVAL_MS);
          })

      }
    } else {
      // logout();
      return;
    }
  }
  
  return response.json();
};

export default $api;
