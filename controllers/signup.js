// Sign Up Route Handler

const handleSignup = (req, res, db, bcrypt, saltRounds) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json("Invalid Form Submission...!");
    }
    bcrypt.hash(password, saltRounds, function (err, hash) {
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email,
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0]);
                            // console.log(user[0]);
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
            .catch(err => res.status(400).json("User already exists... Try Signing In!"));
    })
}

module.exports = {
    handleSignup
}
