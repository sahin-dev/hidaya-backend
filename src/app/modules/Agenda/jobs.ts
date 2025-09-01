
import { Job } from "agenda";
import agenda from "./init";
import {sendSingleNotification} from '../Notification/Notification.service'
import { PrayerService } from "../Prayer/prayer.service";
import { IAuth } from "../Auth/auth.interface";
import { AuthService } from "../Auth/auth.service";

import convertPrayerTimeToUTC from "../../utils/convertTimeToUTC";
import scheduleJob from "../../utils/scheduleJob";


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