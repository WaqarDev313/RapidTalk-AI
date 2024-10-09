const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React app
  },
});

// Listen for incoming connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chat message' events from the client
  socket.on('chat message', async (msg) => {
    const api_call = {
      method: 'POST',
      hostname: 'open-ai21.p.rapidapi.com',
      port: null,
      path: '/claude3',
      headers: {
        'x-rapidapi-key': '3a1f5636c6msh2ae1e5b81393214p146726jsna6b89d9a1cd1',
        'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    }; 

    try {
      const response = await axios.request(options);
      console.log(response.data);
      // Extract the response content from GPT-4
      const botReply = response.data.choices[0].message.content || 'Sorry, I could not understand the response.';

      // Send the response back to the client
      io.emit('chat message', botReply);
      console.log('Emitting message to client:', botReply); // Log the bot's response

    } catch (error) {
      // console.error('Error with OpenAI API:', error.message);
    //   if (error.response) {
    //     console.error('Response data:', error.response.data);
    //     console.error('Status code:', error.response.status);
    //     console.error('Headers:', error.response.headers);
    // }
    
      io.emit('chat message', 'Sorry, I am having trouble responding right now. Try again later.');
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
