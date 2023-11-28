import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/providers/StoreProvider";
import $api from "@/sharedComponents/api/api";
import { IncomeOutcomeType } from "@/serviceEntities/Task/model/types/task";

export const fetchOutcomeTypes = createAsyncThunk<
  IncomeOutcomeType[],
  undefined,
  ThunkConfig<string>
>("buyingsList/fetchOutcomeTypes", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const responseData = await $api(__API__ + "tasks/outcomeTypes", {
      method: "GET",
    });

    if (!responseData.data) {
      throw new Error();
    }

    return responseData.data;
  } catch (e) {
    return rejectWithValue("error");
  }
});
