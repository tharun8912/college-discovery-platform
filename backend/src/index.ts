import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import collegeRoutes from "./routes/collegeRoutes";
import predictorRoutes from "./routes/predictorRoutes";
import qaRoutes from "./routes/qaRoutes";
import savedRoutes from "./routes/savedRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin:"*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "CampusCompass API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/colleges", collegeRoutes);
app.use("/api/predictor", predictorRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/saved", savedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
