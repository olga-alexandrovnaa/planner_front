import $api from "./api";

export const logout = async () => {
  try {
    const response = await $api(__API__ + "auth/logout", {
      method: "POST",
    });
    if (!response.result || response.result !== true) {
      throw new Error();
    }
    return response.data;
  } catch (e) {
    throw new Error();
  }
};
export default logout;
