//2018-2024 https://production-calendar.ru/get/ru/2025/json

import { DD_MM_YYYYtoDate } from '../DD_MM_YYYYtoDate';
import {holidays} from './holidays';
export const getAllHolidays = (year: number) => {
    const list = holidays.find((e)=>e.dt_start.includes(String(year)));
    if(!list) return [];
    const res =  list.days.filter((e) => [3,4,6].includes(e.type_id)).map((e)=>({
        ...e,
        type_text: String(e.type_text),
        date: DD_MM_YYYYtoDate(e.date),
        note: e.note ? e.note : ''
    }));
    return res;
}
