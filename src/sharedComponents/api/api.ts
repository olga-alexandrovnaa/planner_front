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

  // Продолжить если refresh токен не обновляется
  const interval = setInterval(() => {
    if (!isRefreshing) {
      clearInterval(interval);
    }
  }, INTERVAL_MS);

  // Получить юзера и token из localStorage
  const authData = localstorageAuthData();

  // Настроить config
  config.credentials = "include";
  config.headers = getHeaders(authData.token);

  // Отправить запрос
  let response = await originalFetch(resource, config);

  // Если не авторизовано и не повторный
  if (response.status === 401 && !("_isRetry" in config)) {
    Object.assign(config, { _isRetry: true });
    //Если refresh токен не обновляется - обновить
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await refresh();
        //записать новый accessToken
        authData.token = response.accessToken;
        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(authData));
      } catch (e) {
        isRefreshing = false;
        throw new Error();
      }
      isRefreshing = false;
    } else {
      // Продолжить если refresh токен не обновляется
      const interval = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(interval);
        }
      }, INTERVAL_MS);

      // Получить юзера и token из localStorage
      const authData = localstorageAuthData();

      // Настроить config
      config.credentials = "include";
      config.headers = getHeaders(authData.token);
    }
    //Отправить запрос
    response = await originalFetch(resource, config);
  }

  return response.json();
};

export default $api;
