export const refresh = async () => {
  try {
    const response = await fetch(__API__ + "auth/refresh", {
      // credentials: 'include',
      method: "POST",
    });
    const responseJSON = await response.json();

    if (!responseJSON.result || responseJSON.result !== true) {
      throw new Error();
    }
    return responseJSON.data;
  } catch (e) {
    throw new Error();
  }
};
