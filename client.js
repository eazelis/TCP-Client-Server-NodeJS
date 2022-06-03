const net = require('net');
const { exit } = require('process');

const prompt = require('prompt-sync')({sigint: true});
let PORT = 12500;
let HOST = 'localhost';


const client = net.createConnection(PORT, HOST);

client.on('connect', () => { // When connected
    client.on('data', data =>{ // When messahe from server received.
        console.log(data.toString()); // Convert buffer message to user friendly message
        if(data.includes('Exit')) { // If exit in the message exist
            console.log('Goodbey!');
            exit(); // Sending message goodbey and exiting application
        }
        else { // if nothing above 
            var msg = prompt('Client: '); // getting client input
            client.write(msg); // Sending client message to server
        }
        
    }); 
    
});





