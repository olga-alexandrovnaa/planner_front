import $api from "./api";

export const logout = async () => {
  try {
    const response = await $api(__API__ + "auth/logout", {
      method: "POST",
    });
    return response;
  } catch (e) {
    throw new Error();
  }
};
export default logout;
