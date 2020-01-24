import BITBOX from 'bitbox-sdk';

const bitbox = new BITBOX.BITBOX();

export const wait = (staticAddress, callback) => {
  console.log("Waiting for transactions ...");
  console.log();

  const legacy = bitbox.Address.toLegacyAddress(staticAddress);

  const socket = new bitbox.Socket();
  socket.listen('transactions', rawTx => {
    const tx = JSON.parse(rawTx);

    for (let o in tx.outputs) {
      const output = tx.outputs[o];
      
      if (output.scriptPubKey.addresses.length !== 1) continue;
      if (output.scriptPubKey.addresses[0] !== legacy) continue;
      
      console.log('Saw transaction', tx.format.txid);
      console.log('You sent', output.satoshi, 'satoshis');

      const amount = output.satoshi;
      const fee = process.env.FEE_AMOUNT_SATS;

      if (amount < fee) {
        console.log('Unfortunately, that is not enough.');
        console.log('Please send at least the minimum fee of', fee, 'satoshis.');
        console.log('The difference will be sent to a fresh wallet and printed for your cold hold pleasure');
        continue;
      } 
    
      console.log('After subtracting the fee of', fee, 'satoshis,');
      console.log('you will receive', amount - fee, 'satoshis on your new wallet');

      return callback(staticAddress, amount - fee);
    }
  });
}
