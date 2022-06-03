Assignment description:

Modify the given TCP server (use the tcp_server.cc and tcp_client.cc and
Makefile code in Session 17) or create your own client server system using a programming
language of your choice that allows people to book tickets for a festival.
Create a Festival Booking System for the Robotics Festival using the client/server approach. The
system will be able to return a quote for booking tickets for the festival. The client will be greeted
with an appropriate message asking to make a booking. The system should allow the person to
book multiple different tickets for both adult and children at once. The booking format for example
could be:

[Name] [Type of Ticket] [Quantity of Adult’s tickets] [Quantity of Children’s Tickets] [Type of Ticket] 

However, it is up to you the input form you should use.
The server should book all the tickets that are available and indicate those where the person is put
on a waiting list. You could also include a discount of 10% if the person spends more than £500.
The user could type in ‘Hamzepur VIP 3 2 Saturday 1 0’ into the client terminal
(Connected to the server), the server will reply with:’Hamzepur Your Tickets for the
Robotics Festival are booked and cost £225. No discount given’. The
system should check if the information typed in is correct, such as is the type of the ticket one of
those provided. The system should check if the specific tickets are sold out, and if they are put the
person on the waiting list for those tickets and then process only the available tickets. 

Once the user has booked their tickets, they should be allowed to book activities to take part in at
the festival. The client should ask the user what additional activities they wish to book, pass
these to the server who calculates the cost and then the server passes the booking information
to the client who prints the cost of additional activities on the screen. The cost of the tickets and
the cost of activities should be combined to create a final total. 

![image](https://user-images.githubusercontent.com/95705759/171916861-188e2435-201e-4b5e-9401-bc30e9011d6e.png)


![image](https://user-images.githubusercontent.com/95705759/171916881-ec30cc02-9a80-4287-b024-448e3631e6ea.png)
