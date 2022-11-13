Image analizer
===

Analize provided image and provides corrdinates of cell with given level.
Solition uses Node.js, express, sharp

## Run locally

#### Prerequisites
1. Nodejs

Execute one of the following commands:

`npm test` - to run tests

`npm run dev` - to start the server in dev mode (through nodemon)

`npm start` - to start the server in prod mode

## Run in docker

It is also possible to run service in docker. Execute the following command

`docker-compose up`

## Run tests in docker

It is also possible to run tests in docker. Execute the following command

`docker-compose -f ./docker-compose.test.yaml up`

## Possible improvements

1. Parallelize image processsing with workers or similar
2. Improve tests
3. Improve grid detection
4. Non-full cells (ad images with those cells) are not discarded
