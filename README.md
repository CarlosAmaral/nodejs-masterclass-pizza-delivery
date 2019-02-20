# Nodejs Masterclass #2

#### NodeJS Masterclass Pizza Delivery API

## Pre-Requirement:
- NodeJS version >= 8

## Instructions:
1) Start the development server by running `npm run index.js`;
2) Open postman or an equivalent application to make Http requests;
3) Make requests to available routes and methods:
    - users (e.g. `localhost:3080/users`) 
        - /GET (required fields: email)
        - /POST (required fields: name, email, streetAddress)
        - /PUT (required fields: name, email, streetAddress)
        - /DELETE (required fields: email)
    - tokens (e.g. `localhost:3080/tokens`) 
        - /GET (required fields: id)  
        - /POST (required fields: email)
        - /PUT (required fields: id, extend)
        - /DELETE (required fields: id)
    - cart (e.g. `localhost:3080/cart`) 
        - /GET (required fields: id, availableItems)
        - /POST (required fields: id, cart)
        
4) The order is submitted once you do a POST request through the `cart` route with your chosen items (you can retrieve the available items by doing a GET on `cart` if you're logged in as an user);
