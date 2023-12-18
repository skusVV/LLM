export const pipeLogger = (label) => (data) => {
  console.log(`${label}| ${data}`);
  return data;
};
