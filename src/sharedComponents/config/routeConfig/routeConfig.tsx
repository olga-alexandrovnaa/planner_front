import { CalendarPage } from "@/pagesContent/CalendarPage";
import { LoginPage } from "@/pagesContent/LoginPage";
import { MainPage } from "@/pagesContent/MainPage";
import { NotFoundPage } from "@/pagesContent/NotFoundPage";
import { format } from "date-fns";
import { RouteProps } from "react-router-dom";

export enum AppRoutes {
  MAIN = "main",
  CALENDAR='calendar',
  LOGIN = 'login',
  NOT_FOUND = 'not_found'
}

export const getRoutelogin = () => '/login';
export const getRouteMain = (date: string) => `/${date ?? format(new Date(), "dd-MM-yyyy")}`;
export const getRouteCalendar = (date: string) => `/calendar/${date ?? format(new Date(), "dd-MM-yyyy")}`;
export const getRouteNOT_FOUND = () => '*';

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.LOGIN]: {
    path: getRoutelogin(),
    element: <LoginPage />,
  },
  [AppRoutes.MAIN]: {
    path: getRouteMain(':date'),
    element: <MainPage />,
  },
  [AppRoutes.CALENDAR]: {
    path: getRouteCalendar(':date'),
    element: <CalendarPage />,
  },
  
  [AppRoutes.NOT_FOUND]: {
    path: getRouteNOT_FOUND(),
    element: <NotFoundPage />,
},
};
