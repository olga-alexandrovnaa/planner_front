
export interface DayTasksListSchema {
  list: {id: number}[]; //над типом подумать
  isLoading: boolean;
  error?: string;
}
