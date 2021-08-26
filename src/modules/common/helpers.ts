export const isEmptyOrSpaces = (str: string) => {
  return str === null || str === undefined || str.trim() === "";
};

export const isLengthNotInRange = (str: string, min: number, max: number) => {
  return str.length < min || str.length > max;
};

export const errorHelperGenerator = (message: string) => {
  return { validateStatus: "error", help: message };
};

export const getUid = () => {
  const uid = uniqueID();
  return uid;
};

function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return (
    chr4() +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    chr4() +
    chr4()
  );
}
