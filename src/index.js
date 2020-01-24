import dotenv from 'dotenv';
import { makeNewKey } from './key.js';
import { generateQR } from './qr.js';

dotenv.config();

const go = () => {
  console.log();
  console.log('Welcome to the Newkey generator!');
  console.log('This app uses a static address to receive BCH.');
  console.log('A small fee will be collected from any received BCH,');
  console.log('and the remainder will be sent to a fresh wallet.');

  const staticKey = makeNewKey(process.env.STATIC_ADDRESS_ENTROPY);
  
  return generateQR(staticKey).then(qr => {
    console.log();
    console.log(staticKey);
    console.log(qr);
    console.log();
    console.log('Send BCH, and receive a new address with that BCH')
    console.log();
  });
}

go();
