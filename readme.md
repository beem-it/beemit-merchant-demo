# beemit-merchant-demo

This repository contains an example commerce site and demostrates how to integrate BeemIt payments in a web checkout flow.

## Setup

- Install dependancies

      ```
      yarn install
      ```

- Copy the .env.example file

  ```
  cp .env.example .env
  ```

- Fill in the access credentials in the .env file

- Run the local server

      ```
      node server/index.js
      ```

- The demo website should now be running on `localhost:8081` (default port in .env)

## Making a payment

- The application generates orders with random amounts
- Tapping on the Pay with BeemIt button creates an order and displays the QR code
- Scan the QR code on the mobile application, make the payment
- The status updates on the sample app once the payment is complete
