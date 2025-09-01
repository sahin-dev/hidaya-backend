import { DateTime } from "luxon";


export default function convertPrayerTimeToUTC(timeStr:string, timezone:string) {
  // timeStr example: "04:35"
  const [hour, minute] = timeStr.split(':').map(Number);
    console.log(hour, minute, timezone)
 
  const localDateTime = new Date().setHours(hour, minute, 0, 0);
  return new Date(localDateTime)
}