import cls from "./CalendarPage.module.scss";
import { MonthForm } from "@/programFeatures/MonthDaySelector";

function CalendarPage() {
  return (
    <div className={cls.CalendarPage}>
      <MonthForm />

    </div>
  );
}

export default CalendarPage;
