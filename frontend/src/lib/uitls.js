export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const generateTimestamp = () => {
  return Math.floor(Date.now() / 1000); // Unix timestamp in seconds
};
