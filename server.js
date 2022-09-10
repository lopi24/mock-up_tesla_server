const http = require('http');
const app = require('./app');
require('dotenv').config()

const port = process.env.PORT;

const server = http.createServer(app);

//database connection
app.listen(port, () => console.log(`You've got served on port ${port}`)); // here in server.js we just put the port and this is where we listen to the port.

// server.listen(port);