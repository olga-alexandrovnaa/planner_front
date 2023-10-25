import { format } from "date-fns";

export const DD_MM_YYYYtoDate = (str: string): Date => {
    const arr = str.split("-").map((e) => Number(e));
    if (
      arr.length !== 3 ||
      isNaN(new Date(arr[2], arr[1] - 1, arr[0]).valueOf())
    ) {
      return new Date();
    }
    return new Date(arr[2], arr[1] - 1, arr[0]);
}
