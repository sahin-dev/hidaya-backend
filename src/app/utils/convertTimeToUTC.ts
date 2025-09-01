import { DateTime } from "luxon";


export default function convertPrayerTimeToUTC(timeStr:string, timezone:string) {
  // timeStr example: "04:35"
  const [hour, minute] = timeStr.split(':').map(Number);

  // Construct DateTime for today with the prayer time in the given timezone
  const localDateTime = DateTime.now().setZone(timezone)
    .set({ hour, minute, second: 0, millisecond: 0 });

  // Convert to UTC JS Date for scheduling
  return localDateTime.toUTC().toJSDate();
}