const { execFileSync } = require('node:child_process');

function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function normalizeDatabaseUrl(name) {
  let rawValue = process.env[name]?.trim();
  if (!rawValue) {
    if (name === 'DIRECT_URL' && process.env.DATABASE_URL) {
      process.env.DIRECT_URL = process.env.DATABASE_URL;
      return;
    }
    throw new Error(`${name} is missing. Set it to a PostgreSQL connection URL in Render.`);
  }

  const assignment = rawValue.match(/^[A-Z_]+\s*=\s*(.*)$/s);
  let value = assignment ? assignment[1].trim() : rawValue;

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim();
  }

  if (value.startsWith('postgres://')) {
    value = `postgresql://${value.slice('postgres://'.length)}`;
  }

  if (!value.startsWith('postgresql://')) {
    throw new Error(`${name} must start with postgresql://. Do not include the variable name or quotes.`);
  }

  try {
    const scheme = 'postgresql://';
    const rest = value.slice(scheme.length);
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const userInfoStr = rest.slice(0, lastAtIndex);
      const hostAndBeyond = rest.slice(lastAtIndex + 1);

      const firstColonIndex = userInfoStr.indexOf(':');
      if (firstColonIndex !== -1) {
        const rawUser = userInfoStr.slice(0, firstColonIndex);
        const rawPass = userInfoStr.slice(firstColonIndex + 1);

        const safeUser = encodeURIComponent(safeDecode(rawUser));
        const safePass = encodeURIComponent(safeDecode(rawPass));

        value = `${scheme}${safeUser}:${safePass}@${hostAndBeyond}`;
      }
    }
  } catch (e) {
    // Ignore encoding errors
  }

  process.env[name] = value;
}

normalizeDatabaseUrl('DATABASE_URL');
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
} else {
  normalizeDatabaseUrl('DIRECT_URL');
}

const npm = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npmRunner = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (args) => execFileSync(npm, args, { stdio: 'inherit', env: process.env, shell: true });

const path = require('node:path');
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.resolve(__dirname, '../backend/prisma/schema.prisma');

// Ensure all packages including devDependencies (vite, typescript) are installed
execFileSync(npmRunner, ['install', '--include=dev'], { cwd: rootDir, stdio: 'inherit', env: process.env, shell: true });

run(['prisma', 'generate', '--schema', schemaPath]);

// Build frontend and backend
execFileSync(npmRunner, ['run', 'build', '--workspace=frontend'], { cwd: rootDir, stdio: 'inherit', env: process.env, shell: true });
execFileSync(npmRunner, ['run', 'build', '--workspace=backend'], { cwd: rootDir, stdio: 'inherit', env: process.env, shell: true });

try {
  run(['prisma', 'db', 'push', '--schema', schemaPath]);
} catch (err) {
  console.error('\n=== PRISMA DATABASE CONNECTION ERROR ===');
  console.error('Prisma failed to connect to the database: invalid connection string or port number.');
  console.error('Please verify your DATABASE_URL environment variable in your Render dashboard.');
  console.error('Expected format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require');
  console.error('Note: If your password contains special characters like @, #, $, %, :, make sure they are URL-encoded (e.g. @ -> %40)');
  console.error('========================================\n');
  throw err;
}
