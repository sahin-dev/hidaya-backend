import mongoose from "mongoose";
import { IZone } from "./auth.interface";

const CityZoneSchema = new mongoose.Schema({  
  city: { type: String, required: true, unique: true },
  zone: { type: String, required: true },
});

const Zone = mongoose.model<IZone>('Zone', CityZoneSchema);

export default Zone;