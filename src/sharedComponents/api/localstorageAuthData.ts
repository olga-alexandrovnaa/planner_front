import { USER_LOCALSTORAGE_KEY } from "../const/localstorage";

const localstorageAuthData = () => {
  const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  let authData;
  if (user) {
    try {
      authData = JSON.parse(user);
    } catch {
      authData = undefined;
    }
  }
  return authData
}
export default localstorageAuthData;
