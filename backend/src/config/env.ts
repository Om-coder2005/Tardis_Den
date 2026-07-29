import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}
