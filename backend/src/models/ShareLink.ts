import mongoose, { Document, Schema, Types } from "mongoose";

export type ShareTargetType = "folder" | "file";

export interface IShareLink extends Document {
  shareId: string;
  type: ShareTargetType;
  targetFolder?: Types.ObjectId;
  targetFile?: Types.ObjectId;
  isActive: boolean;
}

const shareLinkSchema = new Schema<IShareLink>(
  {
    shareId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["folder", "file"], required: true },
    targetFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
    targetFile: { type: Schema.Types.ObjectId, ref: "File" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IShareLink>("ShareLink", shareLinkSchema);
