import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFile extends Document {
  name: string;
  url: string;
  folder: Types.ObjectId;
  owner: Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true }, // dummy URL ok
    folder: { type: Schema.Types.ObjectId, ref: "Folder", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IFile>("File", fileSchema);
