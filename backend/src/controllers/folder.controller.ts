import { Response } from "express";
import Folder from "../models/Folder";
import File from "../models/File";
import ShareLink from "../models/ShareLink";
import { AuthRequest } from "../middleware/auth";
import { randomUUID } from "crypto";

// Get all top-level folders
export const getRootFolders = async (req: AuthRequest, res: Response) => {
  const folders = await Folder.find({
    owner: req.userId,
    parentFolder: null
  }).sort({ createdAt: -1 });
  res.json(folders);
};

export const createFolder = async (req: AuthRequest, res: Response) => {
  const { name, parentFolder } = req.body;
  const folder = await Folder.create({
    name,
    parentFolder: parentFolder || null,
    owner: req.userId
  });
  res.status(201).json(folder);
};

export const renameFolder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const folder = await Folder.findOneAndUpdate(
    { _id: id, owner: req.userId },
    { name },
    { new: true }
  );
  if (!folder) return res.status(404).json({ message: "Folder not found" });
  res.json(folder);
};

export const deleteFolder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  // simple delete (no deep cascade for assignment)
  await File.deleteMany({ folder: id, owner: req.userId });
  await Folder.deleteOne({ _id: id, owner: req.userId });
  res.json({ message: "Folder deleted" });
};

export const getFolderContent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const folder = await Folder.findOne({ _id: id, owner: req.userId });
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  const childFolders = await Folder.find({ parentFolder: id, owner: req.userId });
  const files = await File.find({ folder: id, owner: req.userId });
  res.json({ folder, childFolders, files });
};

// Share link for folder
export const createFolderShareLink = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const folder = await Folder.findOne({ _id: id, owner: req.userId });
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  const share = await ShareLink.create({
    shareId: randomUUID(),
    type: "folder",
    targetFolder: folder._id
  });

  res.status(201).json(share);
};

export const revokeShareLink = async (req: AuthRequest, res: Response) => {
  const { shareId } = req.params;
  const share = await ShareLink.findOneAndUpdate(
    { shareId },
    { isActive: false },
    { new: true }
  );
  if (!share) return res.status(404).json({ message: "Share link not found" });
  res.json(share);
};
