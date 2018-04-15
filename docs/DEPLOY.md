# Deploy

How to deploy OGV.

## Build app

For this you will need node, meteor.  
 * Install dependencies 
  ```sh
  $ npm install
  ```
  * Create directory and build
  ```sh
  $ mkdir ../build
  $ meteor ../build
  ```
  * Or use existing script (for linux only)
  ```sh
  $ npm run build:linux
  ```

## Prepare your server environment

For running you will need node and running mongo database.  
You **don't need** meteor.

Copy archive(bundle) from build and extract it. Then install dependencies at EXTRACTED_BUNDLE/bundle/programs/server

```sh
$ npm install
```

## Start OGV

Go to EXTRACTED_BUNDLE/bundle and Start OGV using this command. Change parameters as you need.

```sh
METEOR_SETTINGS='{"adminPassword": "password"}' MONGO_URL=mongodb://localhost/meteor ROOT_URL=http://localhost PORT=3000 node main.js
```