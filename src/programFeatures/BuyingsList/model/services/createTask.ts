import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { CreateTaskDto, TaskExt } from '@/serviceEntities/Task/model/types/task';

export const createTask = createAsyncThunk<
    TaskExt,
    { date: string, buyings: number[], outcome: number, outcomeTypeId?: number },
    ThunkConfig<string>
>('buyingsList/createTask', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    const dto: CreateTaskDto = {
        date: data.date,
        name: 'Покупки',
        taskBuyings: data.buyings,
        outcomeTypeId: data.outcomeTypeId,
        taskRepeatDayCheck: [
            {
                id: 0,
                date: data.date,
                checked: true,
                trackerId: 0,
                isDeleted: false,
                moneyOutcomeFact: data.outcome,
            }
        ]
    }

    try {
        const responseData = await $api(__API__ + `tasks`, { body: JSON.stringify(dto), method: "POST" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
