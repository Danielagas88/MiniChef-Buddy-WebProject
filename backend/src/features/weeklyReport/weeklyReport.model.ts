import mongoose, { Schema } from "mongoose";

const WeeklyEventSchema = new Schema(
  {
    type: { type: String, enum: ["recipe", "game"], required: true },
    title: { type: String, required: true },
    when: { type: String, required: true },
  },
  { _id: false }
);

const WeeklyReportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    weekLabel: { type: String, default: "This Week" },
    totals: {
      recipes: { type: Number, default: 0 },
      games: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    events: { type: [WeeklyEventSchema], default: [] },
  },
  { timestamps: true }
);

export const WeeklyReport = mongoose.model("WeeklyReport", WeeklyReportSchema);
