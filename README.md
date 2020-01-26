# Ice Cubed Wallet

### ice³

a service for accepting BCH, charging a small fee, then printing a fresh paper wallet containing the remaining BCH.

## Developer Setup

Use NodeJS version 13.7.0 or higher.

Install the dependencies.

```sh
$ yarn install
```

Make yourself a `.env` file.

```sh
$ cp .env.example .env
```

Update `.env` appropriately

* `STATIC_ADDRESS_ENTROPY`
  
  Change this to some long random secret. Using the same value here guarantees that you get the same static deposit address each time the program executes.

* `FEE_AMOUNT_SATS`

  The minimum fee, in Satoshis, that the service collects for processing a new transaction. Any transaction sent to the deposit address containing less than this amount of Sats will not be processed.

* `NEW_TX_TIMEOUT_SEC`

  The time, in seconds, that a new transaction which is currently being processed will be displayed on the terminal, before the deposit address is re-displayed. This is a simply a  "buffer" time, to improve the user experience, so that multiple deposits sent at the same time don't visually overwhelm the screen.

## Run the program

```sh
$ yarn start
```

-----

Made with 🖤 in Cleveland