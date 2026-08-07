import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

async function setAdminPasskey() {
  const pinArg = process.argv[2];

  if (!pinArg || !/^\d{6}$/.test(pinArg)) {
    console.error('Usage: npx tsx scripts/set-passkey.ts <6_digit_pin>');
    console.error('Example: npx tsx scripts/set-passkey.ts 987654');
    process.exit(1);
  }

  const saltRounds = 12;
  const hash = await bcrypt.hash(pinArg, saltRounds);

  const envPath = path.resolve(__dirname, '../.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Remove existing ADMIN_PASSKEY and ADMIN_PASSKEY_HASH
  let lines = envContent.split('\n').filter(line => 
    !line.startsWith('ADMIN_PASSKEY=') && !line.startsWith('ADMIN_PASSKEY_HASH=')
  );

  lines.push(`ADMIN_PASSKEY_HASH="${hash}"`);
  const updatedEnv = lines.join('\n');

  fs.writeFileSync(envPath, updatedEnv, 'utf8');

  console.log('✅ Admin Passkey successfully hashed and saved!');
  console.log(`🔐 PIN: ${pinArg}`);
  console.log(`🛡️  Bcrypt Hash stored in backend/.env: ${hash}`);
}

setAdminPasskey();
