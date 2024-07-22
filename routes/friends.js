/**
 * Overview:
 *  Implementation of the CRUD operations for:
 *  viewing, adding, editing and deleting friends.
 * 
 * Router endpoints:
 *  GET "/"         - skeletal endpoint, retrieve all friends
 *  GET "/:email"   - retrive one single friend by email ID
 *  PUT "/"         - update details of a specific friend by email ID
 *  POST "/"        - add new friend
 *  DELETE "/:email"- delete a friend using specified email ID
 */

const express = require('express');
const router = express.Router();

let friends = {
    "johnsmith@gamil.com": { "firstName": "John", "lastName": "Doe", "DOB": "22-12-1990" },
    "annasmith@gamil.com": { "firstName": "Anna", "lastName": "smith", "DOB": "02-07-1983" },
    "peterjones@gamil.com": { "firstName": "Peter", "lastName": "Jones", "DOB": "21-03-1989" }
};



// GET request: Retrieve all friends
router.get("/", (req, res) => {

    // Send JSON response with formatted data
    res.send(JSON.stringify(friends, null, 4))
});


// GET by specific ID request: Retrieve a single friend with email ID
router.get("/:email", (req, res) => {
    const email = req.params.email;

    if (friends[email]) {
        res.send(friends[email]);
    } else {
        res.send("The request friend does not exist.");
    }

});


// POST request: Add a new friend
router.post("/", (req, res) => {
    // check if an email is provided in the request body
    if (req.body.email) {

        // create or update a friend's details
        friends[req.body.email] = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "DOB": req.body.DOB
        };

        res.send(`The friend ${req.body.firstName} was created.`);

    } else {
        res.send("Unable to create/update friend. Check prvoded email.");
    }

});


// PUT request: Update the details of a friend with email id
router.put("/:email", (req, res) => {
    const email = req.params.email;

    // Retrieve friend object associated with email
    let friend = friends[email];

    if (friend) { // if the requested friend exists

        // if a parameter is provided, update the corresponding obj property
        let { firstName, lastName, DOB } = req.body;

        if (firstName) { friend["firstName"] = firstName; }
        if (lastName) { friend["lastName"] = lastName; }
        if (DOB) { friend["DOB"] = DOB; }

        // update the friends array
        friends[email] = friend;

        // send a response
        res.send(`The friend the email=${email} was updated`);

    } else { // if the requested friend does not exist
        res.send(`Can't find the friend the email=${email}`);
    }

});


// DELETE request: Delete a friend by email id
router.delete("/:email", (req, res) => {
    const email = req.params.email;

    if (email) {
        delete friends[email];

    }

    res.send(`The friend with ${email} email was deleted.`);
});






module.exports = router;