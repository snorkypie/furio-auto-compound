import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Decimal from 'decimal.js';

// function compound() public
// function getParticipant(address) public returns (Participant)
import abi from './abi.json';

import * as config from './config';
import { log, sleep } from './helpers';

const provider = new StaticJsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.PRIVATE_KEY as string, provider);
const contract = new ethers.Contract(config.CONTRACT as string, abi, signer);
const wallet = signer.address;

async function shouldCompound() {
  try {
    const { timestamp } = await provider.getBlock('latest');
    const { balance, lastRewardUpdate } = await contract[
      'getParticipant(address)'
    ](wallet);
    const rewards = await contract['availableRewards(address)'](wallet);
    const furBalance = new Decimal(balance.toString()).div(1e18).toFixed(4);
    const furRewards = new Decimal(rewards.toString()).div(1e18).toFixed(4);
    const untilAction = +lastRewardUpdate + config.compoundInterval - timestamp;

    log(
      true,
      `Balance: ${furBalance} FUR Rewards: ${furRewards} FUR, until compound: ${untilAction}s`
    );

    return untilAction / 60 > 5 ? 30 : untilAction > 5 ? 5 : 0;
  } catch {
    log(true, `Crashed while fetching FUR data`);
  }

  return 10;
}

async function compound() {
  try {
    log(false, 'Initiating compound');
    const transaction = await contract['compound']();
    if ((await transaction.wait())?.status !== 1) {
      log(false, 'Tried to compound but got status !== 0 (failed)');
      await sleep(60);
      return;
    }

    log(false, 'Successfully compounded');
  } catch (err) {
    log(false, 'ERROR', err);
  }
}

(async () => {
  setTimeout(async function compoundLoop() {
    const untilAction = await shouldCompound();
    if (!untilAction) {
      await compound();
    }

    setTimeout(compoundLoop, untilAction);
  }, 0);
})();
