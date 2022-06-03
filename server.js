const net = require('net'); // TCP Module
const fs = require('fs'); // File handler

let HOST = 'localhost';
let PORT = 12500;

let CS = 0, message = '', input = [], part = '',indexA, indexC, ticketPrice = 0, lenOfInput, activityPrice = 0,bookedInfo = '';

const ticket = { // Ticket Object
    name: [],
    adult: [],
    child: [],
    quantity: []
}
const activity = { // Activity Object
    name: [],
    adult: [],
    child: [],
    quantity: []
}


readTicketsFile(fs); // Reading Tickets and then storing data from file to our object (Ticket = {} ) above
readActivityFile(fs) // Reading Activityand then storing data from file to our object (Activity = {} ) above

const server = net.createServer(); // Creating Socket (Server) for our application

server.on('connection', (socket) => { // When client conencts to server...
    console.log('Connected by '+ socket.remoteAddress +':'+socket.remotePort ) // Printing connected client IP:PORT
    printTickets(socket); // Printing Ticket information which further will be booked

    socket.on('data', (data) => { // When server recieves a message...
        console.log(socket.remoteAddress + ": " + data); // Printing a message from Client
        main(data, socket, CS); // Calling our main program
    });

    socket.on('close', ()=> { // When client disconnects we notifying the server
        console.log(socket.remoteAddress +':'+socket.remotePort + " disconnected.")
    });

    socket.on('error', (err)=>{ // On error, we print error message
        console.log(err);
    });
});
server.listen(PORT, HOST, ()=>{ // Listening for connections.
    console.log("Listening for new connetions on " + HOST +':'+ PORT);
});

// Main program
async function main(data, socket, CS){ // In our application we expecting to get 4 correct message (If not we letting Client to fix message)
    switch(CS){
        case 0:
            bookTicket(data, socket); // Function for booking a ticket
            break;
        case 1:
            bookActivity(data,socket); // Function for finding out if client wants to book activity
            break;
        case 2:
            choosenActivities(data,socket);// Function for booking a activity
            break;
        case 3:
            finishedBooking(socket, data);// Function for starting everything again from beginning (If he puts incorrect information) or we saving and letting client to pay
            break;
    }
}

// Ticket functions
function printTickets(socket){ // This function print all tickets which we have
    message = 'Welcome to Festival Booking System for the Robotics Festival \nTicket | Cost Adult(A) / Child (C).\n';
    for(let i = 0; i < ticket.name.length; i++){
        message = message + ticket.name.at(i) + ' A:' + ticket.adult.at(i) + ' C:' + ticket.child.at(i) + ' Left:' + ticket.quantity.at(i) + '\n';
    }
    message += '\nEnter ticket: [Name][Type of Ticket][Quantity of Adults][Quantity of Children][Ticket name for Children]';
    socket.write(message);
}

function bookTicket(data, socket){ // This function checks if given booking data is correct with our tickets
    inputToArray(data);
    console.log('1');
    if(input.length === 3 && typeof input[0] === 'string' && ticket.name.includes(input[1]) && isNumber(input[2])){ // Checking if Name = String, Number = Integer, Ticket name in 'Database'.
        indexA = ticket.name.indexOf(input[1]); // Storing ticket index for further use.
        if(ticket.quantity[indexA] >= parseInt(input[2])) { // Checking if we have quantity of tickets.
            ticket.quantity[indexA] -= parseInt(input[2]); // Tickets are taken (Sold), so we taking away from inventory
            console.log('Tickets left (A): ' + ticket.quantity[indexA]);
            console.log('Adults tickets was booked succesfully');
            calculateTicketPrice(socket); // Calling a function for calculating the price of the ticket
        }
        else { // If we dont have tickets, we go back from begging aswell notifying client about currect quantity of tickets.
            socket.write('Sorry, we have only ' + ticket.quantity[indexA]);
            loopRepeat = input.length;
            for(let i = 0; i < loopRepeat; i++){ input.pop();};
        }
    }
    
    else if(input.length === 5 && typeof input[0] === 'string' && ticket.name.includes(input[1]) && isNumber(input[2]) && isNumber(input[3]) && ticket.name.includes(input[4])){ // Verifying if given data is correct for Adult and Children.
        console.log('2');
        indexA = ticket.name.indexOf(input[1]);
        indexC = ticket.name.indexOf(input[4]);
        if(ticket.quantity[indexA] >= parseInt(input[2]) && ticket.quantity[indexC] >= parseInt(input[3])) { // Verifying asked ticket quantity with currect tickets
            ticket.quantity[indexA] -= parseInt(input[2]);
            ticket.quantity[indexC] -= parseInt(input[3])
            console.log('Tickets left (A): ' + ticket.quantity[indexA]);
            console.log('Tickets left (C): ' + ticket.quantity[indexC]);
            console.log('Adults and children tickets was booked succesfully');
            calculateTicketPrice(socket); // Calling a function for calculating the price of the ticket
        }
        else { // If we dont have tickets, we go back from begging aswell notifying client about currect quantity of tickets.
            socket.write('Sorry, we have only ' + ticket.quantity[indexA] +  'for ' + ticket.name[indexA] + ' and ' + ticket.quantity[indexC] + ' for ' + ticket.name[indexC]);
            loopRepeat = input.length;
            for(let i = 0; i < loopRepeat; i++){ input.pop();};
        }
    }
    else { // If given data is not correct, undoing everything and waiting for new data
        socket.write('You put incorrect information, try again.');
        loopRepeat = input.length;
        for(let i = 0; i < loopRepeat; i++){ input.pop();};
    }
}

function inputToArray(data){ // Users message is being stored to an array for easier handling of variables
    data = data.toString('utf8'); // From buffer message to user-friendly message
    for(let i = 0; i < data.length; i++) {
        if(data[i] != ' ') { // With every space, dividing sentence to words
            part += data[i];
        }
        else { // If next letter is not space, we put a letters to combine whole word
            input.push(part);
            part = '';
        }
    }
    input.push(part);
    part = '';
}

function isNumber(num){ // Function for verifying if a variable is a integer
    return /^\d+$/.test(num);
}

function calculateTicketPrice(socket){ // Calculating the price of ticket

    if(input.length === 3){ // If only Adult price
        indexA = ticket.name.indexOf(input[1]);
        ticketPrice = parseInt(ticket.adult.at(indexA)) * parseInt(input[2]);
    }
    else if(input.length === 5){ // Adult with Children price
        indexA = ticket.name.indexOf(input[1]);
        indexC = ticket.name.indexOf(input[4]);
        ticketPrice = parseInt(ticket.adult.at(indexA)) * parseInt(input[2]) + parseInt(input[3]) * parseInt(ticket.child.at(indexC)); 
    }

    message = '' + input[0] + ' Your Ticket for the Robotics Festival are booked and cost ';

    if(ticketPrice < 500){ // If price is more than 500 pounds, we give discount of 10%
        message += ticketPrice + '£. No discount given.';
    }
    else { // If price is lower than 500 pounds, we do not give discount
        ticketPrice *= 0.9;
        message += ticketPrice + '£. 10% discound given.';
    }
    message += '\nDo you want to book activities?';
    socket.write(message);
    lenOfInput = input.length;
    CS++;
}
// Activity functions

function bookActivity(data,socket){ // Asking client if he wants to book activity
    if(data == 'No'|| data == 'no'){ // In this case we skipping activity functions and going to the last function which will save and update our booking systems files, sends a total price and exits.
        console.log('No activity booked');
        calculateActivityPrice(socket);
        CS++;
    }
    else if(data == 'Yes' || data == 'yes'){ // In this case we continuing our program
        printActivity(socket);
        CS++;
    }
}

function printActivity(socket){ // Printing Activity names, prices and quantity of activities.
    message = '\nActivity | Cost Adult(A) / Child (C).\n';
    for(let i = 0; i < ticket.name.length; i++){
        message = message + activity.name.at(i) + ' A:' + activity.adult.at(i) + ' C:' + activity.child.at(i) + ' Left:' + activity.quantity.at(i) + '\n';
    }
    message += '\nEnter activity: [Type of Activity][Quantity of Adults][Quantity of Children][Activity name for Children]';
    socket.write(message);
}

function finishedBooking(socket, data){ 
    if(data == 'No'|| data == 'no'){
        CS=0;
        input = [];
        printActivity(socket);
    }
    else if(data == 'Yes' || data == 'yes'){ // If booking is correct by user, we update ticket and activity files, saving booking.
        updateTicketFile(fs); // From object (Ticket={}) to 'Database' (.TXT)
        updateActivityFile(fs); // From object (Activity={}) to 'Database' (.TXT)
        saveUserBooking(fs) // Booking information to 'Database' (.TXT)
        console.log('Client finished his booking.');
        socket.write('Please choose a payment method...\nThanks for using Festival Booking System for the Robotics Festival. (Exit)');
    }
}

// Case 3


function choosenActivities(data,socket){ // If client want to book activity, this is the part where we continue our application
    inputToArray(data);

    if(input.length === 5 &&  activity.name.includes(input[3]) && isNumber(input[4])){ // if activity data is correct (For Adult activity)
        indexA = activity.name.indexOf(input[3]);
        if(activity.quantity[indexA] >= parseInt(input[4])) { // If we have activity quantity in for booking.
            activity.quantity[indexA] -= parseInt(input[4]); // Selling activities and taking away activity quantity
            console.log('Left activity quantity ' + activity.quantity[indexA]);
            console.log('Adults activity was booked succesfully');
            calculateActivityPrice(socket); // Calculating activity price
        }
    }
    // if activity data is correct (For Adult and Children activity)
    else if(input.length === 9 &&  activity.name.includes(input[5]) && isNumber(input[6]) && isNumber(input[7]) && activity.name.includes(input[8])){
        indexA = activity.name.indexOf(input[5]);
        indexC = activity.name.indexOf(input[8]);
        if(activity.quantity[indexA] >= parseInt(input[6]) && activity.quantity[indexC] >= parseInt(input[7])) {
            activity.quantity[indexA] -= parseInt(input[6]);
            activity.quantity[indexC] -= parseInt(input[7])
            console.log(activity.quantity[indexA]);
            console.log(activity.quantity[indexC]);
            console.log('Adults with children activity was booked succesfully');
            calculateActivityPrice(socket);
        }
    }
    else { // If activity data is not correct, we returning from begging of the activity booking
        socket.write('You put incorrect information, try again.');
        loopRepeat = input.length - lenOfInput;
        for(let i = 0; i < loopRepeat; i++){ input.pop(); }
    }
}

function calculateActivityPrice(socket){
    if(input.length === 5){ // Calculating adult activity price
        indexA = activity.name.indexOf(input[3]);
        activityPrice = parseInt(activity.adult.at(indexA)) * parseInt(input[4]);
    }
    if(input.length === 9){ // Calculating adult with children activity price
        indexA = activity.name.indexOf(input[5]);
        indexC = activity.name.indexOf(input[8]);
        activityPrice = parseInt(activity.adult.at(indexA)) * parseInt(input[6]) + parseInt(input[7]) * parseInt(activity.child.at(indexC)); 
    }

    message = '' + 'Your Activity price: ' + activityPrice + '£. Ticket price: ' + ticketPrice + '£. Full price to pay: ' + fullPrice() + '£.';
    message += '\nIs information is correct?';
    socket.write(message);
    CS++;
}

function fullPrice(){ // Calculating total price
    return ticketPrice + activityPrice; 
}

//// FILE HANDLER

// Ticket File Handler
function readTicketsFile(fs){ // Reading ticket file from 'Database' (.TXT)
    data = '';
    fs.readFile('tickets.txt', function(err, data){
        if (err) throw err;
        data = data.toString('utf8');
        importTicketData(data);
    });
    
}

function sortData(data){ // Filtering data from messy .TXT file to an array
    part = '';
    data = data.replace(/(\r\n|\n|\r)/gm, " ");
    for(let i = 0; i < data.length; i++) {
        if(data[i] != ' ') {
            part += data[i];
        }
        else {
            input.push(part);
            part = '';
        }
    }
}

function importTicketData(data){ // Updating our object ( Ticket = {} ) with data from 'Database' (.TXT)
    sortData(data);
    for(let i = 0; i < input.length; i+= 4){
        ticket.name.push(input[i]);
        ticket.adult.push(input[i + 1]);
        ticket.child.push(input[i + 2]);
        ticket.quantity.push(input[i + 3]);
    }
    input = [];
}



function updateTicketFile(fs){ // Uploading 'Database' (.TXT) from object ( Ticket = {} )
    let content = '';
    for(let i = 0; i < ticket.name.length; i++){
        content += ticket.name[i] + ' ' + ticket.adult[i] + ' ' + ticket.child[i] + ' ' + ticket.quantity[i] + '\n';
    }
    fs.writeFile('tickets.txt', content, function (err) {
        if (err) throw err;
        console.log('Tickets was updated!');
    });
}

// Activity File Handler

function readActivityFile(fs){ // Reading activity file from 'Database' (.TXT)
    data = '';
    fs.readFile('activity.txt', function(err, data){
        if (err) throw err;
        data = data.toString('utf8');
        importActivityData(data);
    });  
}

function importActivityData(data){ // Updating our object ( Activity = {} ) with data from 'Database' (.TXT)
    sortData(data);
    for(let i = 0; i < input.length; i+= 4){
        activity.name.push(input[i]);
        activity.adult.push(input[i + 1]);
        activity.child.push(input[i + 2]);
        activity.quantity.push(input[i + 3]);
    }
    input = [];
}

function updateActivityFile(fs){ // Uploading Database (.TXT) from object ( Activity = {} )
    let content = '';
    for(let i = 0; i < activity.name.length; i++){
        content += activity.name[i] + ' ' + activity.adult[i] + ' ' + activity.child[i] + ' ' + activity.quantity[i] + '\n';
    }
    fs.writeFile('activity.txt', content, function (err) {
        if (err) throw err;
        console.log('Activity was updated!');
    });
}

// Save booking
function saveUserBooking(fs){ // Saving our booking from application to 'Database' (.TXT)
    bookedInfo = '';
    if(input.length === 3){
        bookedInfo = 'Client: ' + input[0] + ', Ticket(A): ' + input[1] + ', Q: ' + input[2] + '\n';
    }
    else if(input.length === 5 && activity.name.includes(input[3]) ){
        bookedInfo = 'Client: ' + input[0] + ', Ticket(A): ' + input[1] + ', Q: ' + input[2] + ', Activity(A): ' + input[3] + ', Q: ' + input[4] + '\n';
    }
    else if(input.length === 5 && ticket.name.includes(input[4])){
        bookedInfo = 'Client: ' + input[0] + ', Ticket(A): ' + input[1] + ', Q: ' + input[2] + ', Ticket(C): ' + input[4] + ', Q: ' + input[3] + '\n';
    }
    else if(input.length === 9){
        bookedInfo = 'Client: ' + input[0] + ', ' + 'Ticket(A): ' + input[1] + ', Q: ' + input[2] + ', Ticket(C): ' + input[4] + ', Q: ' + input[3] + ', Activity(A): ' + input[5] + ', Q: '+ input[6] + ', Activity(C): ' + input[8] +', Q: ' + input[7] + '\n';
    }
    else {
        bookedInfo = 'Unknown Error\n';
    }
    fs.appendFile('bookings.txt', bookedInfo, function (err) {
        if (err) throw err;
        console.log('Booking was saved!');
    })
}

// The reason why 'Database' is in Quotation marks because .TXT figuratively is 'Database'