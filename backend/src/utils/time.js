const generateTimestamp = () => {
  return Math.floor(Date.now() / 1000); // Unix timestamp in seconds
};

export default generateTimestamp;