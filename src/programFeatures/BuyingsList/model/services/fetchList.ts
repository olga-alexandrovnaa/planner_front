import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/providers/StoreProvider";
import $api from "@/sharedComponents/api/api";
import { ListBuying } from "../types/buyingsListSchema";

export const fetchList = createAsyncThunk<
  ListBuying[],
  undefined,
  ThunkConfig<string>
>("buyingsList/fetchList", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const responseData = await $api(__API__ + "buyings", {
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
