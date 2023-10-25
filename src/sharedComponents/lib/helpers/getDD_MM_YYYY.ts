import { format } from "date-fns";

export const getDD_MM_YYYY = (date: Date = new Date()): string => {
    return  `${format(date, 'dd-MM-yyyy')}`
}
