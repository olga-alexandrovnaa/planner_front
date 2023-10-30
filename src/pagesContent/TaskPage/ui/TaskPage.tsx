
import { TaskForm } from "@/serviceEntities/Task";
import cls from "./TaskPage.module.scss";

function TaskPage() {
  return (
    <div className={cls.TaskPage}>
      <TaskForm />

    </div>
  );
}

export default TaskPage;
