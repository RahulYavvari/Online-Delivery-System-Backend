// Import the 'express' module
import express from 'express';
import dotenv from 'dotenv';

// Create an Express application
const app = express();

// Set the port number for the server
const port = process.env.PORT || 5000;

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Customer Service');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});