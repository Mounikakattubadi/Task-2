import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  getRootFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getFolderContent,
  createFolderShareLink,
  revokeShareLink
} from "../controllers/folder.controller";

const router = Router();

router.use(auth);

router.get("/root", getRootFolders);            // Find all folders (top level)
router.post("/", createFolder);
router.get("/:id", getFolderContent);           // Nested view
router.patch("/:id", renameFolder);
router.delete("/:id", deleteFolder);

// share
router.post("/:id/share", createFolderShareLink);
router.patch("/share/:shareId/revoke", revokeShareLink);

export default router;
