// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startHealthPing } from "./services/healthPing";

const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startHealthPing(300000); // 5 minutes
});

