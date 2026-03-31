'use strict';

require('dotenv').config();
const { sendMessage } = require('./claude');

async function main() {
  const reply = await sendMessage('Hello! Please confirm the connection is working.');
  console.log('Claude says:', reply);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
