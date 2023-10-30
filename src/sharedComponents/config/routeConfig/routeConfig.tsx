import { CalendarPage } from "@/pagesContent/CalendarPage";
import { LoginPage } from "@/pagesContent/LoginPage";
import { MainPage } from "@/pagesContent/MainPage";
import { NotFoundPage } from "@/pagesContent/NotFoundPage";
import { TaskPage } from "@/pagesContent/TaskPage";
import { getQueryParams } from "@/sharedComponents/lib/addQueryParams/addQueryParams";
import { RouteProps } from "react-router-dom";

export enum AppRoutes {
  ROOT = "root",
  MAIN = "main",
  CALENDAR = "calendar",
  TASK = "task",
  LOGIN = "login",
  NOT_FOUND = "not_found",
}

export const getRouteMain = (date: string) => `/${date}`;
export const getRouteRoot = () => "/";
export const getRoutelogin = () => "/login";
export const getRouteCalendar = (date: string) => `/calendar/${date}`;
export const getRouteTask = (id: string | 'new', params?: OptionalRecord<string, string>) => `/task/${id}${getQueryParams(params)}`;
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
  [AppRoutes.TASK]: {
    path: getRouteTask(":id"),
    element: <TaskPage />,
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
