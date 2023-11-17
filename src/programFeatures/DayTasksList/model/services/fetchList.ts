import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/providers/StoreProvider";
import $api from "@/sharedComponents/api/api";
import { ListTask } from "../types/dayTasksListSchema";
import { startOfDay } from "date-fns";
import { isArray } from "lodash";
import { modeType } from "@/serviceEntities/Task";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";

export const fetchList = createAsyncThunk<
  { data: ListTask[]; },
  { date: Date, type: modeType },
  ThunkConfig<string>
>("dayTasksList/fetchList", async (data, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  const params = new URLSearchParams({
    date: getYYYY_MM_DD(startOfDay(data.date)),
    type: String(data.type),
  });

  try {
    const responseData = await $api(__API__ + "tasks/dayTasks?" + params, {
      method: "GET",
    });

    if (!responseData.data) {
      throw new Error();
    }

    return responseData;
  } catch (e) {
    return rejectWithValue("error");
  }
});
