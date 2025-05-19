import { Schema, model, Document } from 'mongoose';

export interface IHadith extends Document {
  date: Date;
  source: string;
  content: string;
}

const hadithSchema = new Schema<IHadith>(
  {
    date: { type: Date, required: true },
    source: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Hadith = model<IHadith>('Hadith', hadithSchema);

export default Hadith;
