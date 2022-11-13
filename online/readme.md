Trust network
===

Trust network service for DEV challenge '22. Built with Node.js and MongoDB.

## Run locally

#### Prerequisites
1. Nodejs
2. MongoDB

Set environment variable `MONGODB_URI` with MongoDB server address

Execute one of the following commands:

`npm test` - to run tests

`npm run dev` - to start the server in dev mode (through nodemon)

`npm start` - to start the server in prod mode

## Run in docker

It is also possible to run service in docker. To bring up service in docker `.env` file should be present in the root folder with the following variables:

1. `MONGO_INITDB_ROOT_USERNAME`
2. `MONGO_INITDB_ROOT_PASSWORD`
3. `MONGO_INITDB_DATABASE`
4. `MONGODB_URI`

Then execute the following command

`docker-compose up`

## Possible improvements

1. For now `messages` and `path` endpoints use simple graph traversal. This could take a long time on a large amount of data. Improvements could be made here like moving it to a separate process and algorithm updating
2. `messages` and `path` have a lot of code duplication.
3. Tests have a lot of code duplication.
