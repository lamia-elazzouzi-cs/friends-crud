/**
 * Overview:
 * The objective of this application is to provide access to
 * the "/friends" endpoints only to the authenticateed users.
 * To achieve this, we use Session and JWT authentication.
 * 
 * Endpoints:
 *  /register: The user doesn't have to be authenticated to access endpoint
 *  /login: Allows the registered user to login to access /friends endpoint
 *  /friends: Grants access to endpoints defined in routes/friends.js
 */


const express = require('express');
const app = express();
const session = require('express-session');
const jsonwebtoken = require('jsonwebtoken');
const routes = require('./routes/friends.js');

let users = [];



/**
 * Initializing & configuring the Express-Session middleware
 * 
 * Objective:
 *      Create session object with user-defined secret, as a middleware
 *      Middleware will intercet requests, and ensure the session is valid before processing the request
 * Options:
 * @property {string|Array} secret - This is the secret used to sign the session ID cookie, to prevent its hijacking.
 * @property {boolean} resave - Forces the session to be saved back to the session store, even if the session was never modified during the request.
 * @property {boolean} saveUninitialized - Forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified. 
 */
app.use(session({
    secret: "fingerprint",
    resave: true,
    saveUninitialized: true

}));


app.use(express.json());


// Provide users with a registration endpoint:
app.post("/register", (req, res) => {

    // get user credentials from the request body
    const username = req.body.username;
    const password = req.body.password;

    // if both username & password are provided, proceed with registration logic
    if (username && password) {

        // check if user already exists
        if (!doesExist(username)) {
            // add a new user to users[]
            users.push({ "username": username, "password": password });
            return res.status(200).json(
                { message: "User was successfully created! You can login now." }
            );

        } else {
            return res.status(404).json(
                { message: "User exists already. Please, proceed to login." }
            );
        }
    }

    // if username/password was not provided, return an error
    return res.status(404).json(
        { message: "There was an error registering user. Please try again." }
    );
});

// Verify existence of a given username:
const doesExist = (username) => {
    const existing_users = users.filter((user) => user.username === username);
    return existing_users.length > 0;
}



// Provide users with a login endpoint:
app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // check if password or username is missing
    if (!username || !password) {
        return res.status(404).json(
            { message: "Error loggin in: Missing username/password." }
        );
    }

    // if user is already registered, authenticate user
    if (validUser(username, password)) {

        // generate a JWT, valid for 1 hour
        let accessToken = jsonwebtoken.sign( // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            { data: password },
            'access',
            { expiresIn: 60 * 60 }
        );

        // store accessToken and username in session
        req.session.authorization = { accessToken, username };

        return res.status(200).send(`User ${username}, was successfully logged in.`);

    } else {
        // if login credentials are incorrect
        return res.status(208).json(
            { message: "Invalid login: check username & password" }
        );

    }
});

// check if username & password match an existing user's
const validUser = (username, password) => {

    let valid_users = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    return valid_users.length > 0;
};




// Intercept calls to "/friends" enpoints using middleware
app.use("/friends", function auth(req, res, next) {

    // 1st: check if the user is logged in
    if (req.session.authorization) {

        // 2nd: retrieve the authorization details from the session
        let token = req.session.authorization['accessToken'];

        // 3nd: verify if the token is valid
        jsonwebtoken.verify(token, "access", (err, user) => { // jwt.verify(token, secretOrPublicKey, [options, callback])
            if (!err) {
                req.user = user;

                // 4th: pass control to the next middleware handler 
                next();

            } else {
                return res.status(403).json(
                    { message: `User ${user} is not authenticated` }
                );
            }
        });

    } else {
        // the user is not logged in
        return res.status(403).json(
            { message: "The user is not logged in!" }
        );
    }

});

app.use("/friends", routes);





// Run server:
const PORT = 5000;
app.listen(PORT, () => {
    console.log("-> Server running on port ", PORT);
})
