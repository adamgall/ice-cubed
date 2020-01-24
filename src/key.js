import BITBOX from 'bitbox-sdk';
import crypto from 'crypto';

const bitbox = new BITBOX.BITBOX();

export const makeNewKey = entropy => {
  if (!entropy) entropy = crypto.randomBytes(256);
  const hash = crypto.createHash('sha256').update(entropy, 'utf8').digest();
  const mnemonic = bitbox.Mnemonic.fromEntropy(hash);
  const seedBuffer = bitbox.Mnemonic.toSeed(mnemonic);
  const hdNode = bitbox.HDNode.fromSeed(seedBuffer);
  const mainKey = bitbox.HDNode.toCashAddress(hdNode);
  return mainKey;
};
