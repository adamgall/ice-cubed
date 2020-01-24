import dotenv from 'dotenv';
import { makeNewKey } from './key.js';
import { generateQR } from './qr.js';

dotenv.config();

const go = () => {
  console.log();
  console.log('Welcome to the Ice Cubed Wallet generator!');
  console.log('This app uses a static address to receive BCH.');
  console.log(`A small fee (${process.env.FEE_AMOUNT_SATS} sats) will be collected from any received BCH,`);
  console.log('and the remainder will be sent to a fresh wallet.');

  const staticKey = makeNewKey(process.env.STATIC_ADDRESS_ENTROPY);
  
  return generateQR(staticKey).then(qr => {
    console.log();
    console.log(staticKey);
    console.log();
    console.log(qr);
    console.log();
    console.log('Send BCH, and receive a new address with that BCH')
    console.log();
    console.log("----------------------------------------------------------------------")
    console.log();
  });
}

go();
