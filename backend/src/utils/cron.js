import cron from "cron";
import https from "https";

const API_URL = process.env.API_URL;

const cronJob = new cron.CronJob("*/14 * * * *", () => {
  if (!API_URL) {
    console.error("API_URL is not defined in environment variables.");
    return;
  }

  https
    .get(API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(
          `✅ Cron job ping successful at ${new Date().toLocaleTimeString()}`
        );
      } else {
        console.error(
          `❌ Failed ping: Status code ${res.statusCode} at ${new Date().toLocaleTimeString()}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Error executing cron job: ", err.message);
    });
});

// ✅ Important: Start the job


export default cronJob;
