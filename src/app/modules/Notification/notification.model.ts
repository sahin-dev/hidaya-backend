import mongoose ,{ model, Schema } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth",
        required:true,

    },
    sender :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth",
        required:true,
    }
})

const notificationModel = model<INotification>("notification", notificationSchema)

export default notificationModel