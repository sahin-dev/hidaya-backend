
import { Job } from "agenda";
import agenda from "./init";
import {sendSingleNotification} from '../Notification/Notification.service'
import { PrayerService } from "../Prayer/prayer.service";
import { IAuth } from "../Auth/auth.interface";
import { AuthService } from "../Auth/auth.service";
import { Auth } from "firebase-admin/lib/auth/auth";
import {DateTime} from 'luxon'

interface User{
    user:IAuth
}

interface PrayerNotification {
    token:string
    prayer:{name:string, time:string}
}

agenda.define("users:prayer", async ()=>{
    console.log("Execuring user:prayer")
    try{
       
        const users = await AuthService.getAllUsers()
        
        users.forEach(user => {
            if (user.token)
                scheduleJob(user)
        })
    }catch(err){
        console.log(err)
    }
    
})

const scheduleJob = async (user:IAuth)=>{
    const prayers = await PrayerService.getPrayerTimes(user)

    prayers.forEach(async(prayer:{name:string, time:string, zone:string}) => {
        const date = convertPrayerTimeToUTC(prayer.time, prayer.zone)
        await agenda.schedule(date, "notification:prayer", {token:user.token, prayer})
    })
}

function convertPrayerTimeToUTC(timeStr:string, timezone:string) {
  // timeStr example: "04:35"
  const [hour, minute] = timeStr.split(':').map(Number);

  // Construct DateTime for today with the prayer time in the given timezone
  const localDateTime = DateTime.now().setZone(timezone)
    .set({ hour, minute, second: 0, millisecond: 0 });

  // Convert to UTC JS Date for scheduling
  return localDateTime.toUTC().toJSDate();
}


agenda.define<PrayerNotification>("notification:prayer",async (job:Job<PrayerNotification>)=>{
    console.log("Running job notification:prayer")
    const token = job.attrs.data.token
    const prayerName = job.attrs.data.prayer.name
    const time = job.attrs.data.prayer.time

    try{
        await sendSingleNotification(token, {title:`${prayerName} at ${time}`, body:`Do not miss the ${prayerName} salah.`})
    }catch(err){
        console.log(err)
    }
    

})


export default agenda;