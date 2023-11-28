import { useSelector } from "react-redux";
import { memo, useCallback, useEffect, useState } from "react";
import cls from "./BuyingsListForm.module.scss";
import {
  getBuyingsListCheckedList,
  getBuyingsListIsLoading,
  getBuyingsListList,
  getBuyingsListOutcomeTypes,
} from "../model/selectors/selectors";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import {
  buyingsListActions,
  buyingsListReducer,
} from "../model/slice/dayTasksListSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { fetchList } from "../model/services/fetchList";
import BuyingsListItem from "./BuyingsListItem";
import { Loader } from "@/sharedComponents/ui/Loader";
import { fetchOutcomeTypes } from "../model/services/fetchOutcomeTypes";
import { Button } from "@/sharedComponents/ui/Button";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { createTask } from "../model/services/createTask";
import { getDD_Month_NotReqYYYY } from "@/sharedComponents/lib/helpers/getDD_Month_NotReqYYYY";
import { Modal } from "@/sharedComponents/ui/Modal";
import { CustomAsyncCreatableSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { deleteBuying } from "../model/services/deleteBuying";
import { updateBuying } from "../model/services/updateBuying";
import { createBuying } from "../model/services/createBuying";
import { createOutcomeType } from "../model/services/createOutcomeType";

export interface BuyingsListFormProps {
  date: string;
  className?: string;
}

const initialReducers: ReducersList = {
  buyings: buyingsListReducer,
};

const BuyingsListForm = memo(({ date, className }: BuyingsListFormProps) => {
  const dispatch = useAppDispatch();

  const list = useSelector(getBuyingsListList);
  const checkedList = useSelector(getBuyingsListCheckedList);
  const outcomeTypes = useSelector(getBuyingsListOutcomeTypes);
  const isLoading = useSelector(getBuyingsListIsLoading);

  const [openModal, setOpenModal] = useState(false);
  const [openModalTask, setOpenModalTask] = useState(false);
  const [outcome, setOutcome] = useState(0);
  const [currentDate, setDate] = useState(date);
  const [current, setCurrent] = useState<string>();
  const [outcomeTypeId, setOutcomeTypeId] = useState<number>();

  const onStartCreateTask = useCallback(() => {
    setOpenModalTask(true);
  }, []);

  const onCancelCreateTask = useCallback(() => {
    setOpenModalTask(false);
  }, []);

  const onStartCreate = useCallback(() => {
    setOpenModal(true);
    setCurrent("");
  }, []);

  const onBuyingDelete = useCallback(
    async (id: number) => {
      await dispatch(deleteBuying({ id }));
      dispatch(fetchList());
    },
    [dispatch]
  );

  const onEndCreate = useCallback(async () => {
    await dispatch(createBuying({ note: current }));
    dispatch(fetchList());
    setOpenModal(false);
  }, [current, dispatch]);

  const onCancelCreate = useCallback(() => {
    setOpenModal(false);
  }, []);

  const onCreateOutcomeType = useCallback(
    async (inputValue: string) => {
      const data = await dispatch(createOutcomeType(inputValue));
      if (typeof data.payload !== "string") {
        setOutcomeTypeId(data.payload.id);
      }
      dispatch(fetchOutcomeTypes());
    },
    [dispatch]
  );

  const onCheckChange = useCallback(
    (id: number, check: boolean) => {
      dispatch(buyingsListActions.changeCheck(id));
    },
    [dispatch]
  );
  const onCreateTask = useCallback(async () => {
    setOpenModalTask(false);
    await dispatch(
      createTask({
        date: currentDate,
        outcome: outcome,
        buyings: checkedList.map((e) => e.id),
        outcomeTypeId: outcomeTypeId,
      })
    );
    for (const e of checkedList) {
      await dispatch(updateBuying({ id: e.id, data: { ...e, checked: true } }));
    }

    setOutcome(0);
    dispatch(fetchList());
  }, [checkedList, currentDate, dispatch, outcome, outcomeTypeId]);

  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOutcomeTypes());
  }, [dispatch]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.BuyingsListForm, {}, [className])}>
        {!!openModal && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>Создание покупки</div>
              <div className={cls.InputBlock}>
                {/* <div className={cls.Label}>Название</div> */}
                <Input
                  className={cls.Input}
                  placeholder={"Название"}
                  value={current ?? ""}
                  type="textarea"
                  onChange={(val) => setCurrent(val)}
                />
              </div>
              <div style={{ marginTop: "10px" }} className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelCreate}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button onClick={onEndCreate} className={cls.MainButton}>
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {!!openModalTask && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>Отметить задачи</div>

              <div className={cls.InputBlock}>
                <div className={cls.Label}>Дата</div>
                <Input
                  className={cls.Input}
                  value={currentDate ?? ""}
                  onChange={setDate}
                  type="date"
                  dateValueString={
                    currentDate
                      ? getDD_Month_NotReqYYYY(new Date(currentDate), true)
                      : ""
                  }
                />
              </div>

              <div className={cls.InputBlock}>
                <div className={cls.Label}>Тип</div>
                <CustomAsyncCreatableSelect
                  className={cls.Input}
                  menuPlacement="top"
                  isSearchable
                  onCreateOption={onCreateOutcomeType}
                  value={
                    outcomeTypes && outcomeTypeId
                      ? outcomeTypes
                          .map((e) => ({
                            value: e.id,
                            label: e.name,
                          }))
                          .find((e) => e.value === outcomeTypeId)
                      : undefined
                  }
                  onChange={(val) => setOutcomeTypeId(val.value)}
                  defaultOptions={
                    outcomeTypes
                      ? outcomeTypes.map((e) => ({
                          value: e.id,
                          label: e.name,
                        }))
                      : []
                  }
                />
              </div>
              <div style={{ marginTop: "10px" }} className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelCreateTask}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button onClick={onCreateTask} className={cls.MainButton}>
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {isLoading && (
          <div className={cls.Loader}>
            <Loader />
          </div>
        )}

        <Button className={cls.CreateButton} onClick={onStartCreate}>
          Создать
        </Button>

        <div className={cls.List}>
          {!!list &&
            list.map((item) => (
              <BuyingsListItem
                data={item}
                onDelete={onBuyingDelete}
                onCheckChange={onCheckChange}
                key={item.id}
              />
            ))}
        </div>

        <div className={cls.Footer}>
          <div className={cls.FooterLeft}>
            <div className={cls.InputBlock}>
              <div className={cls.Label}>Потрачено</div>
              <Input
                className={cls.Input}
                value={outcome ?? ""}
                onChange={setOutcome}
                textAfterInput="₽"
                type="number"
              />
            </div>
          </div>
          <div className={cls.FooterRight}>
            <Button className={cls.MainButton} onClick={onStartCreateTask}>
              Отметить
            </Button>
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default BuyingsListForm;
