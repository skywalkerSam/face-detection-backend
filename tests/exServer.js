//Purpose: a blueprint for backend servers

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '',       // Enter DB password here!
        database: 'prod'
    }
});

// console.log(db.select('*').from('users'));

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();

app.use(express.json());
app.use(cors());

const port = 3333;
const saltRounds = 10;

// not a real db ;)
// const db = {
//     users: [
//         {
//             id: '0',
//             name: 'sam',
//             email: 'sam@abc.xyz',
//             password: 'sam',
//             joined: new Date(),
//             entries: 0,
//         },
//         {
//             id: '1',
//             name: 'starboy',
//             email: 'starboy@abc.xyz',
//             // password: 'starboy',
//             joined: new Date(),
//             entries: 0,
//         }
//     ],
//     login: [
//         {
//             id: '0',
//             hash: '',
//             email: 'sam@abc.xyz',
//         },
//         {
//             id: '1',
//             hash: '',
//             email: 'starboy@abc.xyz',
//         }
//     ]
// }


app.get('/', (req, res) => {
    res.json("Welcome to Face Detection API...");

    // res.json(db.users);
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    db.select('email', 'hash').from('login').where({email})     // email : email
        .then(hash =>{
            hash = hash[0].hash;
            // console.log(hash.length);
            // res.json(hash);
            if (hash.length){
                bcrypt.compare(password, hash, function(err, result) {
                // console.log(result);
                (result) ? res.json("You're In... Welcome Back :)") 
                    : res.status(400).json("Wrong Credentials...!");
                }) 
            }
        })
        .catch(err => res.status(400).json("Error Signing In...!"));
    
    // if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
    //     // res.json("Signing In...");
    //     res.json(db.users[0]);
    // } else {
    //     res.status(400).json("Error signing in...");
    // }

    // const { email, password } = req.body;
    // if (email in db.users) {
    //     bcrypt.compare(password, hash, function(err, result) {
    //         console.log(result); 
    //     });
    // }
});


app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // if (!name || !email || !password) {
    //     return res.status(400).json("Please fill out the required information...!");
    // }
    /*
        Transaction is used to make sure that both the tables are updated. if one fails, the other one is also rolled back.
    */
    bcrypt.hash(password, saltRounds, function(err, hash) {
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                // console.log(loginEmail);
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0].name  + ", Signed Up Successfully...!");
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
            })
            .catch(err => res.status(400).json("Error Signing Up... Try Again!"));   //err
        })
        
            // db.users.push({
        //     id: '2',
        //     name: name,
        //     email: email,
        //     // password: hash,
        //     joined: new Date(),
        //     entries: 0,
        // });

    // res.json(db.users[db.users.length - 1]);
    // res.json("Signed Up Successfully...");
});

app.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;
    let found = false;

    db.select('*').from('users').where({
        id: userId
    })
        .then(user => {
            // console.log(user[0]);
            (user.length) ? res.json(user[0]) 
                : res.status(400).json("User not found...!");
        })
        .catch(err => res.status(400).json("Error while getting user info..."));
        /*
            Not getting any errors because, Boolean([]) === true    ...Haha ;)
        */

    // db.users.forEach(user => {
    //     if (user.id === userId) {
    //         found = true;
    //         return res.json(user);
    //     }
    // });

    // if (!found) {
    //     return res.status(400).json("Error getting user info...");
    // }
});

// PUT
app.put('/image', (req, res) => {      
    const { id } = req.body;

    db('users').where({id})     // id : id
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            // console.log(entries);
            (entries.length) ? res.json(entries[0].entries)     //entries
                : res.status(400).json("Entry not found...!");
        })
        .catch(err => res.status(400).json("Error updating entries..."));


    // let status = false;
    // db.users.forEach(user => {
    //     if (user.id === id) {
    //         status = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // });

    // if (!status) {
    //     return res.status(400).json("Error updating entries...");
    // }
});

app.listen(port, () => {
    console.log(`\nServer running on: http://localhost:${port} \n\nPress Ctrl+C to stop.`)
})


/*
API Endpoints:

/ - GET - root/home
/signin - POST - signin
/signup - POST - signup
/profile/:userId - GET - user
/image - PUT - image

*/ 

// tbh, never thought that i'd be here but, here i am ;) 
// 12024.01.04.0441
