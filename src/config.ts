import dotenv from 'dotenv';

dotenv.config();

function die(exitCode: number, str: string) {
  console.error(str);
  process.exit(exitCode);
}

// Read from .env
export const PRIVATE_KEY =
  process.env['PRIVATE_KEY'] || die(1, 'Set `PRIVATE_KEY` in .env');
export const CONTRACT =
  process.env['CONTRACT'] || die(2, 'Set `CONTRACT` in .env');
export const RPC_URL =
  process.env['RPC_URL'] || 'https://bsc-rpc.gateway.pokt.network/';

// Variables
export const compoundInterval = 24 * 3600 - 10; // In milliseconds
