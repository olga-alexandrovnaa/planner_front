import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/providers/StoreProvider";
import $api from "@/sharedComponents/api/api";
import { ListTask } from "../types/dayTasksListSchema";
import { startOfDay } from "date-fns";
import { isArray } from "lodash";
import { tasksType } from "@/serviceEntities/Task";
import { isoString } from "@/sharedComponents/lib/helpers/isoString";

export const fetchList = createAsyncThunk<
  ListTask[],
  { date: Date, type: tasksType },
  ThunkConfig<string>
>("dayTasksList/fetchList", async (data, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  const params = new URLSearchParams({
    date: isoString(startOfDay(data.date)),
    type: String(data.type),
  });

  try {
    const responseData = await $api(__API__ + "tasks/dayTasks?" + params, {
      method: "GET",
    });

    if (!isArray(responseData)) {

      throw new Error();
    }

    return responseData;
  } catch (e) {
    return rejectWithValue("error");
  }
});
