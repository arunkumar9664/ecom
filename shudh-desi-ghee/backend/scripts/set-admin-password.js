import 'dotenv/config';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(query);
    
    // Mask typed characters with asterisks
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (stringToWrite === '\r\n' || stringToWrite === '\n') {
        process.stdout.write('\n');
      } else {
        process.stdout.write('*');
      }
    };

    rl.question('', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function setAdminPassword() {
  try {
    console.log('🔒 Suranghi Naar Admin Password Reset Utility\n');

    // Fetch existing admin user(s) from database
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
    });

    if (adminUsers.length === 0) {
      console.error('❌ Error: No user with role "admin" found in database.');
      process.exit(1);
    }

    console.log(`Targeting admin user(s) in database:`);
    adminUsers.forEach((user) => {
      console.log(`  • Email: ${user.email} (ID: ${user.id})`);
    });
    console.log('');

    // Prompt for new password with masked terminal input
    const password = await promptHidden('Enter new admin password: ');

    if (!password || password.length < 6) {
      console.error('\n❌ Error: Password must be at least 6 characters long.');
      process.exit(1);
    }

    const confirmPassword = await promptHidden('Confirm new admin password: ');

    if (password !== confirmPassword) {
      console.error('\n❌ Error: Passwords do not match.');
      process.exit(1);
    }

    console.log('\nHashing password with bcrypt (10 salt rounds)...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Update passwordHash directly in database for role: 'admin' users
    const result = await prisma.user.updateMany({
      where: { role: 'admin' },
      data: { passwordHash },
    });

    console.log(`\n✅ Success! Updated password hash in database for ${result.count} admin user(s).`);
  } catch (error) {
    console.error('\n❌ An error occurred:', error.message || error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

setAdminPassword();
