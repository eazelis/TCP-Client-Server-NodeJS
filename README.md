Project Title: Festival Booking System for Robotics Festival
This project entails the design and implementation of a TCP client-server system that facilitates the booking of tickets for a Robotics Festival.

Project Description
Utilizing the provided TCP server code (tcp_server.cc and tcp_client.cc from Session 17), or alternatively developing your own client-server system in your preferred programming language, this project aims to deliver a seamless ticket booking experience for festival attendees.

The Festival Booking System will provide a quote to the client for booking tickets. Upon connecting, the client will be greeted with a user-friendly message prompting them to proceed with the booking. The system is designed to accommodate the booking of multiple tickets, differentiated by adult and child categories, in a single transaction.

The suggested booking format is as follows:

[Name] [Type of Ticket] [Quantity of Adult’s tickets] [Quantity of Children’s Tickets] [Type of Ticket]

However, the final decision on the input format is flexible and can be adapted to your preference.

The server's responsibility is to handle all available ticket bookings and provide appropriate feedback when the client is added to a waiting list due to ticket unavailability. An enticing feature of this system is the automatic application of a 10% discount for transactions exceeding £500.

For example, if a user types Hamzepur VIP 3 2 Saturday 1 0 into the client terminal (connected to the server), the server will respond with: Hamzepur, Your Tickets for the Robotics Festival are booked and cost £225. No discount given.

The system ensures accuracy by validating the input information. It checks whether the ticket type exists in the provided options and whether the specific tickets are available. If the tickets are sold out, the system will add the client to the waiting list for those tickets and proceed to process the available ones.

Once the ticket booking process is completed, the system provides the option to book additional festival activities. The client will inquire about the desired activities from the user, send this information to the server, and the server will then calculate the cost. The cost of the activities, returned to the client, is then displayed on the screen.

The total cost of the experience (tickets and activities) is then calculated and presented as a final total.

![image](https://user-images.githubusercontent.com/95705759/171916861-188e2435-201e-4b5e-9401-bc30e9011d6e.png)


![image](https://user-images.githubusercontent.com/95705759/171916881-ec30cc02-9a80-4287-b024-448e3631e6ea.png)
