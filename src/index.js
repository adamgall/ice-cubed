import BITBOX from 'bitbox-sdk';
import crypto from 'crypto';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config();
const bitbox = new BITBOX.BITBOX();

const txsToProcess = [];
const allTxs = [];

const go = () => {
  if (process.env.STATIC_ADDRESS_ENTROPY === null || process.env.STATIC_ADDRESS_ENTROPY === "") {
    console.log();
    console.error("Set STATIC_ADDRESS_ENTROPY environment variable to a long random string, and don't lose it.");
    console.log();
    process.exit(1);
  }

  console.log();
  console.log("----------------------------------------------------------------------");
  console.log();
  console.log('Welcome to the Ice Cubed Wallet generator!');
  console.log('This app uses a static address to receive BCH.');
  console.log(`A small fee (${parseInt(process.env.FEE_AMOUNT_SATS)} sats) will be collected from any received BCH,`);
  console.log('and the remainder will be sent to a fresh wallet.');

  const { address } = makeNewKey(process.env.STATIC_ADDRESS_ENTROPY);
  openTransactionPipe(address, parseInt(process.env.FEE_AMOUNT_SATS));
};

const makeNewKey = entropy => {
  if (!entropy) entropy = crypto.randomBytes(256);
  const hash = crypto.createHash('sha256').update(entropy, 'utf8').digest();
  const mnemonic = bitbox.Mnemonic.fromEntropy(hash);
  const seedBuffer = bitbox.Mnemonic.toSeed(mnemonic);
  const hdNode = bitbox.HDNode.fromSeed(seedBuffer);
  const privateKey = bitbox.HDNode.toWIF(hdNode);
  const address = bitbox.HDNode.toCashAddress(hdNode);
  return { privateKey, address };
};

const openTransactionPipe = (staticAddress, fee) => {
  const legacy = bitbox.Address.toLegacyAddress(staticAddress);

  const socket = new bitbox.Socket();
  socket.listen('transactions', rawTx => {
    const tx = JSON.parse(rawTx);

    for (let o in tx.outputs) {
      const output = tx.outputs[o];

      if (output.scriptPubKey.addresses.length !== 1) continue;
      if (output.scriptPubKey.addresses[0] !== legacy) continue;
      if (allTxs.includes(tx.format.txid)) continue;

      txsToProcess.push({ id: tx.format.txid, amount: output.satoshi });
      allTxs.push(tx.format.txid);
    }
  });

  runTimer(staticAddress, fee);
};

const runTimer = (staticAddress, fee) => {
  const timer = setInterval(() => {
    const tx = txsToProcess.shift();
    if (!tx) return;
    clearInterval(timer);
    processTx(staticAddress, tx, fee);
  }, 500);

  showDeposit(staticAddress);
};

const processTx = (staticAddress, tx, fee) => {
  console.log('Saw transaction', tx.id);
  console.log('You sent', tx.amount, 'satoshis');

  if (tx.amount < fee) {
    console.log('Unfortunately, that is not enough.');
    console.log('Please send at least the minimum fee of', fee, 'satoshis.');
    console.log('The difference will be sent to a fresh wallet and printed for your cold hold pleasure.');
    return;
  }

  console.log('After subtracting the fee of', fee, 'satoshis,');
  console.log('you will receive', tx.amount - fee, 'satoshis on your new wallet.');

  setTimeout(() => runTimer(staticAddress, fee), parseInt(process.env.NEW_TX_TIMEOUT_SEC) * 1000);
};

const showDeposit = staticAddress => {
  return QRCode.toString(staticAddress, { type: 'terminal' }).then(qr => {
    console.log();
    console.log("----------------------------------------------------------------------");
    console.log();
    console.log(staticAddress);
    console.log();
    console.log(qr);
    console.log('Send BCH, and receive a new address with that BCH');
    console.log();
    console.log("----------------------------------------------------------------------");
    console.log();
    console.log('Waiting for deposits...');
    console.log();
  });
};

go();
