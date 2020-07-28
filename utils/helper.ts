export const chainErrorMessage = (failed) => {
  const message = failed.message ? failed.message.split(":").pop() : JSON.stringify(failed);
  if (message) {
    return message.trim();
  }
};
export function isEmpty(obj) {
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
  }
  return true;
}
