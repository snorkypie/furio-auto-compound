export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const logStore = [''];
export const log = (topline: boolean, ...args: any[]) => {
  const msg = [`${new Date().toLocaleString('sv-SE')} FUR-AC:`, ...args].join(
    ' '
  );

  if (topline) {
    logStore[0] = msg;
  } else {
    logStore.push(msg);
  }

  console.clear();
  logStore.forEach((m) => console.log(m));
};
