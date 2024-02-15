/*
Author: @skywalkerSam
Purpose: face-detection-backend
Stardate: 12024.02.02.2031
*/
/*
TODOs:
# Code Review:
    - Separate controllers for each endpoint ( Separation of Concerns ) - DONE!

# Security Review: 
    - Move API requests to the backend - DONE!

# Testing:
    - Test each endpoint with the frontend - DONE!

# Deployment:
    - Deployment provieders n' setup
    - Test 
    - Implement standard security measures!
*/

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || 3333;
const DATABASE = process.env.DATABASE;
const DATABASE_USER = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.PASSWORD;
// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/prod'

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

const knex = require('knex')
const db = knex({
    client: 'pg',
    connection: {
        DATABASE_URL: process.env.DATABASE_URL,
    }
});

app.get('/', (req, res) => { res.json("Welcome to Face Detection API...") });

// Dependency Injection
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/signup', (req, res) => { signup.handleSignup(req, res, db, bcrypt, saltRounds) });
app.get('/profile/:userId', (req, res) => { profile.handleGetProfile(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.clarifaiRequest(req, res) });


app.listen(PORT, () => {
    console.log(`\nServer running on: http://localhost:${PORT} \n\nPress Ctrl+C to stop.`)
})



/* 
Sample Images URLs:

    - https://samples.clarifai.com/metro-north.jpg

    - https://cdna.artstation.com/p/assets/images/images/072/167/834/large/eunice-ye-.jpg?1706752364

    - https://cdna.artstation.com/p/assets/images/images/072/178/120/large/alex-gray-tbrender-camera-38.jpg?1706781629

    - https://cdnb.artstation.com/p/assets/images/images/072/184/959/4k/hwng-edric-nguyen-tbrender-viewport-009.jpg?1706793715

*/
