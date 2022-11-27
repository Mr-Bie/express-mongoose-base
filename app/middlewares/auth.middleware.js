const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1]

    if (!token) {
        return res.status(400).send('token is not valid.')
    }

    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY)
    } catch (e){
        return res.status(401).send({
            message: 'Invalid Token.',
        })
    }

    next()
}