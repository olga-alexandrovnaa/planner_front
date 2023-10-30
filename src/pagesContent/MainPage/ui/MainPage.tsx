import { UserAuthDataForm } from "@/serviceEntities/User";
import cls from "./MainPage.module.scss";
import { WeekForm } from "@/programFeatures/WeekDaySelector";
// import { Button } from "@/sharedComponents/ui/Button";
// import $api from "@/sharedComponents/api/api";
// import { useCallback } from "react";

function MainPage() {
  // const sendTestResquest = useCallback(async () => {
  //   try {
  //     await $api(__API__ + "users/getMe", {
  //       method: "GET",
  //     });
      
  //   } catch (e) {
  //     throw new Error();
  //   }
  // }, []);

  // const sendTestFewResquests = useCallback(() => {
  //   sendTestResquest();
  //   sendTestResquest();
  //   sendTestResquest();
  //   sendTestResquest();
  //   sendTestResquest();
  // }, [sendTestResquest]);

  return (
    <div className={cls.MainPage}>
      {/* <UserAuthDataForm /> */}

      <WeekForm />

      {/* <Button onClick={sendTestResquest}>Отправить 1 запрос</Button>
      <Button onClick={sendTestFewResquests}>Отправить 5</Button> */}
    </div>
  );
}

export default MainPage;
