import { Document ,Types} from "mongoose";

export interface INotification extends Document{
    title:string
    body:string
    isRead:boolean
    sender:Types.ObjectId
    receiver:Types.ObjectId
}