import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import User from "../models/User";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/seed-admin", async (_req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      return res.json({ message: "Admin already exists", id: existing._id });
    }

    const user = await User.create({
      email: "admin@example.com",
      password: "password123"
    });

    return res.json({
      message: "Admin created",
      id: user._id,
      email: user.email
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
