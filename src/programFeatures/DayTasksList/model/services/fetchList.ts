import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/providers/StoreProvider";
import { getDayTasksDayAndTypeForService } from "../selectors/selectors";
import $api from "@/sharedComponents/api/api";
import { ListTask } from "../types/dayTasksListSchema";
import { startOfDay } from "date-fns";
import { isArray } from "lodash";

export const fetchList = createAsyncThunk<
  ListTask[],
  undefined,
  ThunkConfig<string>
>("dayTasksList/fetchList", async (_, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi;

  const data = getDayTasksDayAndTypeForService(getState());

  const params = new URLSearchParams({
    date: startOfDay(data.date).toISOString(),
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
