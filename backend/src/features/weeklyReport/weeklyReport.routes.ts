import { Router } from "express";
import { WeeklyReport } from "./weeklyReport.model";
import { auth } from "../../middleware/middleware";




const router = Router();

// GET my weekly report
router.get("/me", auth, async (req: any, res) => {
  const userId = req.user.id; // תלוי אצלך איך שמור user ב-request
  const report = await WeeklyReport.findOne({ userId });
  return res.json({ report: report || null });
});

// PUT update my weekly report (save)
router.put("/me", auth, async (req: any, res) => {
  const userId = req.user.id;
  const { weekLabel, totals, events } = req.body;

  const updated = await WeeklyReport.findOneAndUpdate(
    { userId },
    { userId, weekLabel, totals, events },
    { upsert: true, new: true }
  );

  return res.json({ ok: true, report: updated });
});

export default router;

