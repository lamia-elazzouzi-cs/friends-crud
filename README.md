# friends-crud Project

This is a node CRUD project demonstrating operations on transient data, by creating API endpoints with an Express Server. 


## Overview

In this project, we retrict the CRUD operations to authenticated users using JWT and session authentication.

- The `friends` object is a JSON/dictionary with `email` as the key and `friends` object as the value. 
    - The `friends` object is a dictionary with `firstName`, `lastName`, `DOB` mapped to their respective values. 
- We'll be using "body" from the HTTP request instead of "query" and "params".
- Only authenticated users will be able to perform all the CRUD operations.
- We will be testing the output of the endpoints on Postman.

## Getting Started

### Installation

Clone the repository:

`git clone https://github.com/lamia-elazzouzi-cs/friends-crud.git`

Install dependencies:

`npm install`

Start server:

`npm start`

