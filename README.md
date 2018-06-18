# Rocketrip
#### A node/express application that does captcha-style word-count provision and validation

### Setup
This server requires node ^8.x to run. Please visit <https://nodejs.org/en/download/package-manager/> to install node via a package manager, or <https://nodejs.org/en/download/> to download and install elsewise.

To test your installation, enter `node -v` into the terminal, with output like such: `v9.2.0`

Updated releases of node come with `npm` (node package manager). To test your npm installation, enter `npm -v` into the terminal, with output like such: `5.5.1`



### Installation
After cloning this repository, navigate to the top-level of the directory and run `npm install`

This will install the required packages for the server, as well as for the jasmine unit testing


### Running tests
To run the unit tests, input `npm test` into the terminal while at the top-level of the directory


### Starting the server
To start the server, input `node server.js` into the terminal while at the top-level of the directory

You should see the following: `Listening on 8000`

The server is now running and is accessible at `http://localhost:8000`, serving just one endpoint: `/` for GET and POST requests


### Stopping the server

To gracefully shutdown the server, press `CTRL C` in the terminal and you should see the following: 
```Shutting down server...
Server shutdown complete.
```
