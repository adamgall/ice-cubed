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

## Run the program

```sh
$ yarn start
```

-----

Made with 🖤 in Cleveland