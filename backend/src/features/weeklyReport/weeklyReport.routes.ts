import { Router } from "express";
import { WeeklyReport } from "./weeklyReport.model";
import { auth } from "../../middleware/middleware";

const router = Router();

// GET /api/weekly-report/me
router.get("/me", auth, async (req: any, res) => {
  try {
    const userId = req.user?._id;
    const report = await WeeklyReport.findOne({ userId });
    return res.json({ report: report || null });
  } catch (err) {
    console.error("GET weekly report error:", err);
    return res.status(500).json({ message: "Failed to load weekly report" });
  }
});

// PUT /api/weekly-report/me
router.put("/me", auth, async (req: any, res) => {
  try {
    const userId = req.user?._id;
    const { weekLabel, totals, events } = req.body;

    const updated = await WeeklyReport.findOneAndUpdate(
      { userId },
      { userId, weekLabel, totals, events },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, report: updated });
  } catch (err) {
    console.error("PUT weekly report error:", err);
    return res.status(500).json({ message: "Failed to save weekly report" });
  }
});

export default router;
