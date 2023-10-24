import { UserAuthDataForm } from "@/serviceEntities/User";
import cls from "./CalendarPage.module.scss";
import MonthForm from "@/programFeatures/MonthDaySelector/ui/MonthForm";

function CalendarPage() {
  return (
    <div className={cls.CalendarPage}>
      <UserAuthDataForm />

      <MonthForm />

    </div>
  );
}

export default CalendarPage;
