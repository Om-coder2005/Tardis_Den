import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function normalizeDatabaseUrl(name: 'DATABASE_URL' | 'DIRECT_URL') {
  let rawValue = process.env[name]?.trim();
  if (!rawValue) {
    if (name === 'DIRECT_URL' && process.env.DATABASE_URL) {
      process.env.DIRECT_URL = process.env.DATABASE_URL;
      return;
    }
    return;
  }

  const assignment = rawValue.match(/^[A-Z_]+\s*=\s*(.*)$/s);
  let value = assignment ? assignment[1].trim() : rawValue;

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim();
  }

  if (value.startsWith('postgres://')) {
    value = `postgresql://${value.slice('postgres://'.length)}`;
  }

  try {
    const scheme = 'postgresql://';
    if (value.startsWith(scheme)) {
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
    }
  } catch {
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
