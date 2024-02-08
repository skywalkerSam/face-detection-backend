// Sign In Route Handler

const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Invalid Form Submission...!");
    }
    db.select('email', 'hash').from('login').where({ email })
        .then(hash => {
            hash = hash[0].hash;
            if (hash.length) {
                bcrypt.compare(password, hash, function (err, result) {
                    if (result) {
                        return db.select('*').from('users').where({ email })
                            .then(user => {
                                res.json(user[0]);
                            })
                            .catch(err => res.status(400).json("Error Signing In...!"));
                    } else {
                        res.status(400).json("Wrong Credentials, Try Again...!");
                    }
                })
            }
        })
        .catch(err => res.status(400).json("User not found... Try Signing Up!"));
}

module.exports = {
    handleSignin
}
