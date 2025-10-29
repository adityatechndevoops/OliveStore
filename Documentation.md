# Documentation 

### Folder Structure for Backend
```
   server/
   ├── config/
   │   └── db.js         # Database connection
   ├── models/
   │   ├── User.js       # For admin/staff login
   │   ├── Store.js      # For Kirana Store details
   │   └── Order.js      # For order details (from stores)
   ├── routes/
   │   ├── authRoutes.js    # Routes for login/logout
   │   ├── storeRoutes.js   # Routes for store management
   │   └── orderRoutes.js   # Routes for order details
   ├── controllers/
   │   ├── authController.js
   │   ├── storeController.js
   │   └── orderController.js
   ├── middleware/
   │   └── authMiddleware.js # For protecting routes
   ├── .env              # Environment variables
   ├── server.js         # Main application file
   └── package.json
```

To Run Your Backend:
Make sure you have Node.js installed.

Navigate to the server directory in your terminal.

Run npm install to install all dependencies.

Run npm start (if you add "start": "node server.js" to your package.json scripts) or node server.js. If you installed nodemon, you might add "dev": "nodemon server.js" and run npm run dev for auto-restarts on file changes.