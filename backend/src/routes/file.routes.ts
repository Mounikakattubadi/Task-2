import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createFile,
  renameFile,
  deleteFile,
  createFileShareLink
} from "../controllers/file.controller";

const router = Router();

router.use(auth);

router.post("/", createFile);
router.patch("/:id", renameFile);
router.delete("/:id", deleteFile);

router.post("/:id/share", createFileShareLink);

export default router;
