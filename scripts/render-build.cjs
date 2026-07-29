const { execFileSync } = require('node:child_process');

function normalizeDatabaseUrl(name) {
  const rawValue = process.env[name]?.trim();
  if (!rawValue) {
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

  process.env[name] = value;
}

normalizeDatabaseUrl('DATABASE_URL');
if (process.env.DIRECT_URL) normalizeDatabaseUrl('DIRECT_URL');

const npm = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npmRunner = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (args) => execFileSync(npm, args, { stdio: 'inherit', env: process.env, shell: true });

run(['prisma', 'generate', '--schema', 'backend/prisma/schema.prisma']);
execFileSync(npmRunner, ['run', 'build'], { stdio: 'inherit', env: process.env, shell: true });
run(['prisma', 'db', 'push', '--schema', 'backend/prisma/schema.prisma']);
