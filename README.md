# Space-Trader Backend

## Getting Started

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=express-mongoose-es6-rest-api:* yarn start
```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

## Credits
Kunal Kapadia – @kunalkapadia12 – kunalkapadia12@gmail.com


