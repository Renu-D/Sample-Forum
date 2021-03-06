const expressJwt = require('express-jwt');
const config = require('../config/config.json');
const userService = require('../users/service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            ///\/api\/users\/.*/,
            // public routes that don't require authentication
            '/api/users/login',
            '/api/users/register',
            '/'
            //'/api/users/posts/addPost'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
    //console.log(user.username);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};