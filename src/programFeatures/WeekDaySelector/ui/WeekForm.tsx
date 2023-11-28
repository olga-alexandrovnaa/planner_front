import { useSelector } from "react-redux";
import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import cls from "./WeekForm.module.scss";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { weekActions, weekReducer } from "../model/slice/weekSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import {
  getAllIngredients,
  getAllIngredientsEnd,
  getAllIngredientsStart,
  getSelectedDay,
  getShowedMonthYearString,
  getShowedWeekNumber,
  getShowedYear,
  getWeekDates,
} from "../model/selectors/selectors";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getRouteCalendar,
  getRouteMain,
  getRouteTask,
} from "@/sharedComponents/config/routeConfig/routeConfig";
import { WeekDay } from "../model/types/weekSchema";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { DD_MM_YYYYtoDate } from "@/sharedComponents/lib/helpers/DD_MM_YYYYtoDate";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { ReactComponent as Calendar } from "@/sharedComponents/assets/icons/calendar.svg";
import { ReactComponent as Link } from "@/sharedComponents/assets/icons/link.svg";
import { getAllHolidays } from "@/sharedComponents/lib/helpers/holidays/getAllHolidays";
import { UserAuthDataForm } from "@/serviceEntities/User";
import { DayTasksListForm } from "@/programFeatures/DayTasksList";
import { modeType } from "@/serviceEntities/Task";
import { Button } from "@/sharedComponents/ui/Button";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";

import { ReactComponent as AllTasks } from "@/sharedComponents/assets/icons/tasks.svg";
import { ReactComponent as Food } from "@/sharedComponents/assets/icons/food.svg";
import { ReactComponent as Money } from "@/sharedComponents/assets/icons/money.svg";
import { ReactComponent as SelfData } from "@/sharedComponents/assets/icons/selfData.svg";
import { ReactComponent as Bag } from "@/sharedComponents/assets/icons/bag.svg";
import { ReactComponent as Menu } from "@/sharedComponents/assets/icons/menu.svg";
import { fetchAllIngredients } from "../model/services/fetchAllIngredients";
import { Modal } from "@/sharedComponents/ui/Modal";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { getDD_Month_NotReqYYYY } from "@/sharedComponents/lib/helpers/getDD_Month_NotReqYYYY";
import { putDayNote } from "../model/services/putDayNote";
import { fetchDayNote } from "../model/services/fetchDayNote";
import { Editor } from "@tinymce/tinymce-react";
import { BuyingsListForm } from "@/programFeatures/BuyingsList";

export interface WeekFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  weekForm: weekReducer,
};

const WeekDayForm = memo(
  ({ day, onClick }: { day: WeekDay; onClick: (value: string) => void }) => {
    const onClickHandler = useCallback(() => {
      onClick(day.date);
    }, [day.date, onClick]);

    return (
      <div
        className={classNames(cls.WeekDay, {
          [cls.SelectedWeekDay]: day.isSelected,
          [cls.CurrentDate]: day.isCurrent,
          [cls.DayOffDate]: day.isDayOff || !!day.holiday,
        })}
        onClick={onClickHandler}
      >
        <div className={cls.WeekDayName}>{day.shortName}</div>
        <div className={cls.WeekDayDate}>{day.day}</div>
      </div>
    );
  }
);

const WeekForm = memo(({ className }: WeekFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { date } = useParams<{ date: string }>();

  const [type, setTypeState] = useState<modeType>();

  useEffect(() => {
    let t = localStorage.getItem("type");

    if (!t) {
      t = "all";
      localStorage.setItem("type", t);
    }

    setTypeState(t);
  }, [type]);

  const setType = useCallback((t: modeType) => {
    setTypeState(t);
    localStorage.setItem("type", t);
  }, []);

  const paramDate = useMemo(() => {
    return DD_MM_YYYYtoDate(String(date));
  }, [date]);

  useEffect(() => {
    if (
      getDD_MM_YYYY(paramDate) === getDD_MM_YYYY(new Date()) &&
      date !== getDD_MM_YYYY(new Date())
    ) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date())));
    }
    dispatch(weekActions.setSelectedDay(paramDate));
  }, [date, dispatch, navigate, paramDate]);

  const selectedDay = useSelector(getSelectedDay);
  const showedWeekNumber = useSelector(getShowedWeekNumber);
  const showedYear = useSelector(getShowedYear);
  const showedMonthYearString = useSelector(getShowedMonthYearString);
  const weekDates = useSelector(getWeekDates);

  useEffect(() => {
    if (showedYear) {
      dispatch(weekActions.setHolidays(getAllHolidays(showedYear)));
    }
  }, [dispatch, showedYear]);

  const onSelectDay = useCallback(
    (value: string) => {
      const d = DD_MM_YYYYtoDate(value);
      dispatch(weekActions.setSelectedDay(d));
      const route = getRouteMain(value);
      navigate(route);
    },
    [dispatch, navigate]
  );

  const onSelectToday = useCallback(() => {
    onSelectDay(getDD_MM_YYYY(new Date()));
  }, [onSelectDay]);

  const onOpenCalendar = useCallback(() => {
    navigate(getRouteCalendar(getDD_MM_YYYY(selectedDay)));
  }, [navigate, selectedDay]);

  const onSwipeRight = useCallback(() => {
    dispatch(weekActions.showNextWeek());
  }, [dispatch]);

  const onSwipeLeft = useCallback(() => {
    dispatch(weekActions.showLastWeek());
  }, [dispatch]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchStart(e.targetTouches[0].clientX);
      setTouchEnd(0);
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 150 && touchEnd !== 0) {
      onSwipeRight();
    }
    if (touchStart - touchEnd < -150 && touchEnd !== 0) {
      onSwipeLeft();
    }
  }, [onSwipeLeft, onSwipeRight, touchEnd, touchStart]);

  const location = useLocation();

  const onCreate = useCallback(() => {
    const params: OptionalRecord<string, string> = {
      date: getYYYY_MM_DD(selectedDay),
      isFood: type === modeType.food ? "1" : "0",
      backPath: location.pathname,
    };
    navigate(getRouteTask("new", params));
  }, [selectedDay, type, location.pathname, navigate]);

  const allIngredientsEnd = useSelector(getAllIngredientsEnd);
  const allIngredientsStart = useSelector(getAllIngredientsStart);
  const allIngredients = useSelector(getAllIngredients);

  const editorRef = useRef(null);

  const [allIngredientsOpen, setAllIngredientsOpen] = useState(false);

  const putDayNoteHandler = useCallback(async () => {
    if (editorRef.current) {
      const data = editorRef.current.getContent();
      await dispatch(
        putDayNote({ date: getYYYY_MM_DD(selectedDay), note: data })
      );
      await dispatch(fetchDayNote(getYYYY_MM_DD(selectedDay)));
    }
  }, [dispatch, selectedDay]);

  const fetchDayNoteHandler = useCallback(
    async (editor: any) => {
      editorRef.current = editor;
      const res = await dispatch(fetchDayNote(getYYYY_MM_DD(selectedDay)));
      if (editorRef.current && typeof res.payload !== "string") {
        editorRef.current.setContent(res.payload.note);
      }
    },
    [dispatch, selectedDay]
  );

  const onChangeAllIngredientsStart = useCallback(
    (val: string) => {
      dispatch(weekActions.setAllIngredientsStart(val));
    },
    [dispatch]
  );

  const onChangeAllIngredientsEnd = useCallback(
    (val: string) => {
      dispatch(weekActions.setAllIngredientsEnd(val));
    },
    [dispatch]
  );

  useEffect(() => {
    if (allIngredientsOpen) {
      dispatch(fetchAllIngredients());
    }
  }, [
    dispatch,
    date,
    allIngredientsStart,
    allIngredientsEnd,
    allIngredientsOpen,
  ]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div
        className={classNames(cls.WeekForm, {}, [className])}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!!allIngredientsOpen && (
          <Modal isOpen={true}>
            <div className={cls.ModalData}>
              <div className={cls.Header}>
                <div className={cls.LabelTopCenter}>
                  Необходимые ингредиенты за период
                </div>
                <div className={cls.InputBlock}>
                  <div className={cls.Label}>с</div>
                  <Input
                    className={cls.Input}
                    value={allIngredientsStart}
                    type="date"
                    dateValueString={
                      allIngredientsStart
                        ? getDD_Month_NotReqYYYY(
                            new Date(allIngredientsStart),
                            true
                          )
                        : ""
                    }
                    onChange={onChangeAllIngredientsStart}
                  />
                </div>
                <div className={cls.InputBlock}>
                  <div className={cls.Label}>по</div>
                  <Input
                    className={cls.Input}
                    value={allIngredientsEnd}
                    type="date"
                    dateValueString={
                      allIngredientsEnd
                        ? getDD_Month_NotReqYYYY(
                            new Date(allIngredientsEnd),
                            true
                          )
                        : ""
                    }
                    onChange={onChangeAllIngredientsEnd}
                  />
                </div>
              </div>

              <div className={cls.Content}>
                <div className={cls.allIngredients}>
                  {allIngredients.map((e) => (
                    <div className={cls.allIngredient}>
                      <div>{e.product.name}</div>
                      <div>{`${e.count} ${e.product.measureUnit.name}`}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cls.Footer}>
                <div style={{ marginTop: "10px" }} className={cls.ButtonBlock}>
                  <Button
                    onClick={() => setAllIngredientsOpen(false)}
                    className={cls.MainButton}
                  >
                    ОК
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        <div className={cls.Header}>
          <div className={cls.DatesHeader}>
            <div className={cls.DatesHeaderLeft}>
              <div
                className={classNames(cls.Icon)}
                onClick={() => {
                  setType(modeType.otherInfo);
                }}
              >
                <Menu width={20} height={20} />
              </div>
            </div>
            <div className={cls.DatesHeaderCenter}>
              <div className={cls.Icon} onClick={onSwipeLeft}>
                <Left />
              </div>
              <div className={cls.Month} onClick={onOpenCalendar}>
                {showedMonthYearString}
                <div className={cls.Icon} onClick={onSwipeLeft}>
                  <Calendar />
                </div>
              </div>
              <div className={cls.Icon} onClick={onSwipeRight}>
                <Right />
              </div>
            </div>
            <div className={cls.DatesHeaderRight}>
              <UserAuthDataForm />
            </div>
          </div>

          {type !== modeType.otherInfo && type !== modeType.bag && (
            <div className={cls.TodayLink} onClick={onSelectToday}>
              <span>cегодня</span> &nbsp; <Link />
            </div>
          )}

          {type !== modeType.otherInfo && type !== modeType.bag && (
            <div className={cls.Dates}>
              <div className={cls.WeekDay}>
                <div className={cls.WeekDayName}>#</div>
                <div className={cls.WeekDayName}>{showedWeekNumber}</div>
              </div>

              {weekDates.map((d, index) => (
                <WeekDayForm day={d} key={index} onClick={onSelectDay} />
              ))}
            </div>
          )}
        </div>

        <>
          {type !== modeType.selfInfo &&
            type !== modeType.bag &&
            type !== modeType.otherInfo && (
              <div className={cls.Content}>
                {type === modeType.food && (
                  <Button
                    className={cls.BlackButton}
                    onClick={() => setAllIngredientsOpen(true)}
                  >
                    Все ингриденты
                  </Button>
                )}
                <DayTasksListForm date={selectedDay} type={type} />
              </div>
            )}

          {type !== modeType.selfInfo &&
            type !== modeType.bag &&
            type !== modeType.otherInfo && (
              <div className={cls.MainButtonBlock}>
                <Button className={cls.Button} onClick={onCreate}>
                  Создать
                </Button>
              </div>
            )}
        </>

        {type === modeType.selfInfo && (
          <div className={cls.Content}>
            <Editor
              apiKey="kbs8prf677kelamb2n8kghuohos7us4q24ox84tfy9him11j"
              onInit={(evt, editor) => fetchDayNoteHandler(editor)}
              initialValue=""
              init={{
                max_width: 1,
                content_style: "img {max-width: 100%;}",
                height: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
              }}
            />

            <div className={cls.MainButtonBlock}>
              <Button className={cls.Button} onClick={putDayNoteHandler}>
                Сохранить
              </Button>
            </div>
          </div>
        )}
        {type === modeType.bag && (
          <div className={cls.Content}>
            <BuyingsListForm date={getYYYY_MM_DD(selectedDay)}/>
          </div>
        )}

        <div className={cls.Footer}>
          <div
            className={classNames(cls.Icon, {
              [cls.SelectedIcon]: type === modeType.all,
            })}
            onClick={() => {
              setType(modeType.all);
            }}
          >
            <AllTasks width={50} height={50} />
          </div>
          <div
            className={classNames(cls.Icon, {
              [cls.SelectedIcon]: type === modeType.food,
            })}
            onClick={() => {
              setType(modeType.food);
            }}
          >
            <Food width={50} height={50} />
          </div>
          <div
            className={classNames(cls.Icon, {
              [cls.SelectedIcon]: type === modeType.selfInfo,
            })}
            onClick={() => {
              setType(modeType.selfInfo);
            }}
          >
            <SelfData width={45} height={45} />
          </div>

          <div
            className={classNames(cls.Icon, {
              [cls.SelectedIcon]: type === modeType.bag,
            })}
            onClick={() => {
              setType(modeType.bag);
            }}
          >
            <Bag width={50} height={50} />
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default WeekForm;
