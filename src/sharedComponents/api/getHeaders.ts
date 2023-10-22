const getHeaders = (token?: string): Headers => {
  const myHeaders = new Headers();
  // myHeaders.append("Access-Control-Allow-Origin", "https://bretnutunal.beget.app");
  myHeaders.append("Content-Type", "application/json");
  if (token) myHeaders.append("Authorization", "Bearer " + token);
  return myHeaders;
};
export default getHeaders;
