import "dotenv/config";

import app from "./src/app.js";
import { initDB } from "./src/config/db.js";
import { initPostgres } from "./src/config/pg.js";

const PORT = 3000;

const startServer = async () => {
  await initDB();
  await initPostgres();

  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
};

startServer();
