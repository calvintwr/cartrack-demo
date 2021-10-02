# API

This API implements a light-weight ExpressJS module with NodeJS. 

It only has two other production dependencies: 

`cors` (for enabling CORS given the decoupled API and view code), and; 

`debug` (an excellent tool to build useful namespaced debuggers, instead of sloppy `console.logs`)

### Installation

```
// make sure you are in `api` folder
cd <your directory>/cartrack-demo/api

npm install
```

This app also require write priviledges to create folder and write logs. If you are running the app using a user that does not have write priviledges, you will need to perform `chmod` or `chown`, or simply run as the file owner.

### Run the server

The repo comes with pre-compiled JS files in the `dist` folder. You can run:

```
npm start
```
Otherwise, you can also just run the TypeScript code. Or if you wish to develop it:

```
npm run dev
// this uses `ts-node-dev` to "transpile" ts to js.
```

### To run the tests

```
npm run test
```

## To build TS code into production JS

```
npm run build
npm start
```

