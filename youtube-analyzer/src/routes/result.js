import express from "express";
import * as storage from "../utils/storage.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await storage.getJson(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error retrieving result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
