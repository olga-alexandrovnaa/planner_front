import { format, getYear } from "date-fns";

const Months = {
    '1': 'Январь',
    '2': 'Февраль',
    '3': 'Март',
    '4': 'Апрель',
    '5': 'Май',
    '6': 'Июнь',
    '7': 'Июль',
    '8': 'Август',
    '9': 'Сентябрь',
    '10': 'Октябрь',
    '11': 'Ноябрь',
    '12': 'Декабрь',
}

export const getMonthYearString = (date: Date = new Date()): string => {

    const m = format(date, 'L');

    let monthStr = ''; 

    for (const [key, value] of Object.entries(Months)) {
        if(key === m) 
            monthStr = value;
    }

    if(getYear(date) !== getYear(new Date())){
        return `${monthStr} ${getYear(date)}`;
    }

    return  monthStr;
}
