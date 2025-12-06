import { Request, Response } from "express";
import ShareLink from "../models/ShareLink";
import Folder from "../models/Folder";
import File from "../models/File";

export const getPublicResource = async (req: Request, res: Response) => {
  const { shareId } = req.params;
  const share = await ShareLink.findOne({ shareId, isActive: true });
  if (!share) return res.status(404).json({ message: "Link not found" });

  if (share.type === "folder" && share.targetFolder) {
    const folder = await Folder.findById(share.targetFolder);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const files = await File.find({ folder: folder._id });
    const subFolders = await Folder.find({ parentFolder: folder._id });

    return res.json({
      type: "folder",
      folder: { id: folder._id, name: folder.name },
      files,
      subFolders
    });
  }

  if (share.type === "file" && share.targetFile) {
    const file = await File.findById(share.targetFile);
    if (!file) return res.status(404).json({ message: "File not found" });

    return res.json({
      type: "file",
      file
    });
  }

  res.status(400).json({ message: "Invalid share" });
};
