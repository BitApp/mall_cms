export const chainErrorMessage = (failed) => {
  const message = failed.message ? failed.message.split(":").pop() : JSON.stringify(failed);
  if (message) {
    return message.trim();
  }
};
