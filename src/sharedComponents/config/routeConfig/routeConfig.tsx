import { CalendarPage } from "@/pagesContent/CalendarPage";
import { LoginPage } from "@/pagesContent/LoginPage";
import { MainPage } from "@/pagesContent/MainPage";
import { NotFoundPage } from "@/pagesContent/NotFoundPage";
import { format } from "date-fns";
import { RouteProps } from "react-router-dom";

export enum AppRoutes {
  ROOT = "root",
  MAIN = "main",
  CALENDAR = "calendar",
  LOGIN = "login",
  NOT_FOUND = "not_found",
}

export const getRouteMain = (date: string) => `/${date}`;
export const getRouteRoot = () => "/";
export const getRoutelogin = () => "/login";
export const getRouteCalendar = (date: string) => `/calendar/${date}`;
export const getRouteNOT_FOUND = () => "*";

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.LOGIN]: {
    path: getRoutelogin(),
    element: <LoginPage />,
  },
  [AppRoutes.MAIN]: {
    path: getRouteMain(":date"),
    element: <MainPage />,
  },
  [AppRoutes.CALENDAR]: {
    path: getRouteCalendar(":date"),
    element: <CalendarPage />,
  },
  [AppRoutes.ROOT]: {
    path: getRouteRoot(),
    element: <MainPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: getRouteNOT_FOUND(),
    element: <NotFoundPage />,
  },
};
