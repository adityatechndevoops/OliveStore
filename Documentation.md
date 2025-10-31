## OliveStore Backend API Documentation

This document explains how to configure and run the server locally and how to consume the REST APIs from a frontend.

### 1) Prerequisites
- Node.js 18+
- A MongoDB connection string (`MONGO_URI`). Atlas or local MongoDB.
- A `JWT_SECRET` for signing tokens.
<<<<<<< HEAD
- For document uploads (Cloudinary): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
=======
- For document uploads to S3: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`.
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323

### 2) Setup
1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Base URL (local): `http://localhost:5000`

Environment variables used:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
<<<<<<< HEAD
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
=======
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_bucket
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
```

Note: If using MongoDB Atlas, ensure your IP is allowed in the Atlas network access panel.

### 3) Authentication
- JWT auth via `Authorization: Bearer <token>` header.
- Obtain tokens via `POST /api/auth/login`.

<<<<<<< HEAD
### 4) Admin Panel (Web GUI)
Accessible at `/admin` for Admin and Merchant (Vendor) roles.

- Tabs:
  - Admin: Users, Stores, Products
  - Merchant: Stores, Products
- Users management (Admin only): `/admin/users`
- Products management: `/admin/products`
- Stores management: `/stores`

Note: The GUI uses cookie-based auth; API still uses Bearer tokens.

### 5) API Endpoints
=======
### 4) API Endpoints
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323

#### Auth (`/api/auth`)
- POST `/register`
  - Body: `{ name, email, phoneNumber, password, role? }`
  - Response: `{ _id, name, email, phoneNumber, role, token }`

- POST `/login`
  - Body: `{ phoneNumber, password }`
  - Response: `{ _id, name, email, phoneNumber, role, token }`

- GET `/profile` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ _id, name, email, phoneNumber, role }`

- GET `/me` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: full user object (password omitted)

#### Stores (`/api/stores`)
Role policy summary:
- Admin: can list/create/update/delete stores.
<<<<<<< HEAD
- Merchant: can upload own store documents (Cloudinary).
=======
- Merchant: can upload own store documents (S3).
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323

- GET `/` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`
  - Response: `Store[]`

- POST `/` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`
  - Body example:
    ```json
    {
      "storeName": "Kirana Plus",
      "ownerName": "Rahul",
      "contactNumber": "9876543210",
      "email": "kirana@example.com",
      "address": { "street": "12 MG Road", "city": "Pune", "state": "MH", "pincode": "411001" },
      "gstin": "27ABCDE1234F1Z5",
      "fssaiLicense": "1234567890",
      "onboardingStatus": "Pending",
      "bankDetails": { "accountHolderName": "Rahul", "accountNumber": "1234567890", "bankName": "HDFC", "ifscCode": "HDFC0000001" }
    }
    ```

- GET `/:id` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`

- PUT `/:id` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`
  - Body: same shape as POST with any fields to update.

- DELETE `/:id` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`

<<<<<<< HEAD
- PUT `/:id/documents` (Merchant only, upload to Cloudinary)
=======
- PUT `/:id/documents` (Merchant only, upload to S3)
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
  - Headers: `Authorization: Bearer <merchant token>`
  - Content-Type: `multipart/form-data`
  - Form fields:
    - `document`: file (jpeg/png/pdf)
    - `docType`: string (e.g., `gst_certificate`, `fssai_license`, `shop_photo`)
  - Response: `{ message, fileUrl, store }`

#### Orders (`/api/orders`)
Role policy summary:
- Admin/Staff: can list all and view any order.
- Merchant: can create orders for own store, view own orders, update status on own orders.

- GET `/` (Admin/Staff)
  - Headers: `Authorization: Bearer <admin_or_staff token>`
  - Query (optional): `status`, `storeId`
  - Response: `Order[]`

- GET `/me` (Merchant)
  - Headers: `Authorization: Bearer <merchant token>`
  - Response: merchant’s orders.

- GET `/:id` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Access: Admin/Staff OR Merchant owner of the order’s store

- POST `/` (Merchant)
  - Headers: `Authorization: Bearer <merchant token>`
  - Body example:
    ```json
    {
      "storeId": "65f...",
      "customer": {
        "name": "Asha",
        "phoneNumber": "9999999999",
        "address": { "street": "Sector 14", "city": "Gurugram", "pincode": "122001" }
      },
      "items": [ { "name": "Rice", "quantity": 2, "unitPrice": 60 } ],
      "totalAmount": 120,
      "paymentDetails": { "method": "COD", "status": "Pending" }
    }
    ```

- PUT `/:id/status` (Admin/Staff OR Merchant owner)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "status": "Approved", "remark": "Packed" }`

- POST `/:id/comment` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "comment": "Please deliver before 6pm" }`

- PUT `/:id/refund` (Admin only)
  - Headers: `Authorization: Bearer <admin token>`
  - Body example (partial updates allowed):
    ```json
    {
      "postDeliveryRefunds": 30,
      "totalRefund": 50,
      "resolvedIssues": 1,
      "rottenItemCount": 0,
      "damagedItemCount": 1
    }
    ```

<<<<<<< HEAD
### 6) Error Handling & Status Codes
- 200/201 for success, 400 for validation, 401 for unauthorized, 403 for forbidden, 404 for not found, 500 for server errors.
- Standard error object: `{ message: string, error?: string }`.

### 7) Quick Test Checklist
=======
### 5) Error Handling & Status Codes
- 200/201 for success, 400 for validation, 401 for unauthorized, 403 for forbidden, 404 for not found, 500 for server errors.
- Standard error object: `{ message: string, error?: string }`.

### 6) Quick Test Checklist
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
1. Register a user and manually update role to `admin` or `merchant` in DB if needed.
2. Login to obtain JWT.
3. Call protected routes with `Authorization: Bearer <token>`.
4. For S3 upload, ensure all AWS env vars are set and the bucket exists.

<<<<<<< HEAD
### 8) Project Structure
=======
### 7) Project Structure
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
```
config/
controllers/
middleware/
models/
routes/
server.js
package.json
```

This doc reflects the current routes and role checks in the codebase.