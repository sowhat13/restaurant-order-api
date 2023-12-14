
# Restaurant Order API

An example api for food ordering system with mongodb and express.js.

## How to run
Used node version 16.14.0
Used yarn version 1.22.10

yarn build

Add .env file, it must have JWT_SECRET and JWT_SECRET_LOGIN

## Creating example data
For Restaurant datas run: npx mocha --require ts-node/register tests/restaurants.test.ts

For User datas run: npx mocha --require ts-node/register tests/users.test.ts

For Order datas run: npx mocha --require ts-node/register tests/orders.test.ts

## Test Cases
For test cases run: npx mocha --require ts-node/register tests/problems.test.ts

**You need to replica set on your mongo database to run second test case (problem 3) because of mongo transactions https://www.mongodb.com/docs/manual/replication/#transactions
