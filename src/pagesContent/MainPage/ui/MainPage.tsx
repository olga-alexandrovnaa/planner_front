import { UserAuthDataForm } from "@/serviceEntities/User";
import cls from "./MainPage.module.scss";

function MainPage() {

  return <div className={cls.MainPage}>
        <UserAuthDataForm />
    </div>;
}


export default MainPage;
