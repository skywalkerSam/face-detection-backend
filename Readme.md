# Backend server for [face-detection](https://github.com/skywalkerSam/face-detection)

### GitHub: [face-detection-backend](https://github.com/skywalkerSam/face-detection-backend)

### API Deployment: [On Render](https://face-detection-backend-one.onrender.com)

- Using `gRPC` 
- Using Environment Variables!
- The default value of `PORT` is `10000` for all [Render](https://render.com/) web services.


## Please Specify the following...
- `process.env.PORT`
- `process.env.PAT`
- `process.env.USER_ID`

## For `bash` shells
```shell
PAT=enteryourpat USER_ID=yourusername node server.js
```


## Technical Details...

- Express.js
- bcrypt
- postgreSQL
- Knex.js


## Tools Used

- DBeaver
- Postman
- VS Code


## Using nodemon, put this under `"scripts"` in package.json

```json
"start": "nodemon server.js"
```

## Install nodemon
```shell
npm i nodemon
```

## Start the server
```shell
npm start
```

## I'm exhausted by writing this command for deployment everytime...

```bash
git pull ; git status ; git add . ; git commit -m "Deployment" ; git push origin main ; git status
```

## Until next time...

# ;)

