import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5001;

(async () => {
  const mode = await connectDB();
  app.listen(PORT, () => {
    console.log(`\n  ▲ VOID. demo API running on http://localhost:${PORT}`);
    console.log(`  ▲ data source: ${mode}\n`);
  });
})();
