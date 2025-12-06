import { Router } from "express";
import ShareLink from "../models/ShareLink";
import Folder from "../models/Folder";
import File from "../models/File";

const router = Router();

router.get("/:shareId", async (req, res) => {
  try {
    const share = await ShareLink.findOne({
      shareId: req.params.shareId,
      isActive: true
    });

    if (!share) {
      return res.status(404).json({ message: "Not found" });
    }

    const { type, targetFolder, targetFile } = share;

    if (type === "folder" && targetFolder) {
      const folder = await Folder.findById(targetFolder).populate("children files");
      return res.json(folder);
    }

    if (type === "file" && targetFile) {
      const file = await File.findById(targetFile);
      return res.json(file);
    }

    return res.status(400).json({ message: "Invalid share type or target" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
