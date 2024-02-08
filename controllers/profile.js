// Profile Route Handler

const handleGetProfile = (req, res, db) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json("Invalid Form Submission...!");
    }
    db.select('*').from('users').where({
        id: userId
    })
        .then(user => {
            (user.length) ? res.json(user[0])
                : res.status(400).json("User not found...!");
        })
        .catch(err => res.status(400).json("Error while getting user info..."));
}

module.exports = {
    handleGetProfile
}
