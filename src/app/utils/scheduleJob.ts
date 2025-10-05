import agenda from "../modules/Agenda/init"
import { IAuth } from "../modules/Auth/auth.interface"
import { PrayerService } from "../modules/Prayer/prayer.service"
import convertPrayerTimeToUTC from "./convertTimeToUTC"

const scheduleJob = async (user:IAuth)=>{

    try{
        const prayers = await PrayerService.getPrayerTimes(user)
    console.log(`Scheduling prayers for user ${user._id} - ${user.email}`)
    console.log(prayers)
   

    prayers.forEach(async(prayer:{name:string, time:string}) => {
        const date = convertPrayerTimeToUTC(prayer.time, `${user.country}/${user.city}`)
        console.log(date)
        await agenda.schedule(date, "notification:prayer", {token:user.token, prayer})
    })
    }catch(err){
        console.log(err)
    }
    
}

export default scheduleJob