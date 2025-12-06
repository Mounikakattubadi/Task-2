import { Response } from "express";
import File from "../models/File";
import ShareLink from "../models/ShareLink";
import { AuthRequest } from "../middleware/auth";
import { randomUUID } from "crypto";

export const createFile = async (req: AuthRequest, res: Response) => {
  const { name, url, folderId } = req.body;
  const file = await File.create({
    name,
    url,
    folder: folderId,
    owner: req.userId
  });
  res.status(201).json(file);
};

export const renameFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const file = await File.findOneAndUpdate(
    { _id: id, owner: req.userId },
    { name },
    { new: true }
  );
  if (!file) return res.status(404).json({ message: "File not found" });
  res.json(file);
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await File.deleteOne({ _id: id, owner: req.userId });
  res.json({ message: "File deleted" });
};

export const createFileShareLink = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // fileId
  const file = await File.findOne({ _id: id, owner: req.userId });
  if (!file) return res.status(404).json({ message: "File not found" });

  const share = await ShareLink.create({
    shareId: randomUUID(),
    type: "file",
    targetFile: file._id
  });

  res.status(201).json(share);
};
