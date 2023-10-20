import { UserAuthDataForm } from "@/serviceEntities/User";
import cls from "./MainPage.module.scss";
import { Button } from "@/sharedComponents/ui/Button";
import $api from "@/sharedComponents/api/api";
import { useCallback } from "react";

function MainPage() {
  const sendTestResquest = useCallback(async () => {
    try {
      const response = await $api(__API__ + "", {
        method: "GET",
      });
      if (!response.result || response.result !== true) {
        throw new Error();
      }
      return response.data;
    } catch (e) {
      throw new Error();
    }
  }, []);

  const sendTestFewResquests = useCallback(() => {
    sendTestResquest();
    sendTestResquest();
    sendTestResquest();
    sendTestResquest();
    sendTestResquest();
  }, [sendTestResquest]);

  return (
    <div className={cls.MainPage}>
      <UserAuthDataForm />

      <Button onClick={sendTestResquest}>Отправить 1 запрос</Button>
      <Button onClick={sendTestFewResquests}>Отправить 5</Button>
    </div>
  );
}

export default MainPage;
