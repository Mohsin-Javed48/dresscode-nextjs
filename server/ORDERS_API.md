# Orders API Documentation

## Overview

The Orders API provides comprehensive order management functionality for the DressCode e-commerce application. It includes order creation, tracking, status updates, and administrative features.

## Base URL

```
http://localhost:8000/api/orders
```

## Authentication

Most endpoints require user authentication. Include user information in the request body or use proper authentication middleware.

## Endpoints

### 1. Create Order

**POST** `/`

Creates a new order for a user.

**Request Body:**

```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentInfo": {
    "method": "credit_card",
    "transactionId": "txn_123456"
  },
  "pricing": {
    "shippingCost": 10.0,
    "tax": 8.5,
    "discount": 5.0
  },
  "notes": "Please deliver after 5 PM"
}
```

**Response:**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-1234567890-0001",
    "status": "pending",
    "total": 125.50,
    "items": [...],
    "shippingAddress": {...},
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get User Orders

**GET** `/user/:userId` or **GET** `/user`

Retrieves orders for a specific user or current user.

**Query Parameters:**

- `status` (optional): Filter by order status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "orders": [...],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

### 3. Get All Orders (Admin)

**GET** `/`

Retrieves all orders with admin access.

**Query Parameters:**

- `status` (optional): Filter by order status
- `page` (optional): Page number
- `limit` (optional): Items per page
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

### 4. Get Order by ID

**GET** `/:orderId`

Retrieves a specific order by its ID.

**Response:**

```json
{
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-1234567890-0001",
    "user": {...},
    "items": [...],
    "shippingAddress": {...},
    "paymentInfo": {...},
    "pricing": {...},
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Get Order by Order Number

**GET** `/number/:orderNumber`

Retrieves a specific order by its order number.

### 6. Update Order Status (Admin)

**PUT** `/:orderId/status`

Updates the status of an order.

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789",
  "notes": "Order shipped via FedEx"
}
```

### 7. Cancel Order

**PUT** `/:orderId/cancel`

Cancels an order and restores product stock.

**Request Body:**

```json
{
  "reason": "Customer requested cancellation"
}
```

### 8. Get Order Statistics (Admin)

**GET** `/stats/overview`

Retrieves order statistics and analytics.

**Query Parameters:**

- `startDate` (optional): Start date for statistics
- `endDate` (optional): End date for statistics

**Response:**

```json
{
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 25000.0,
    "statusBreakdown": [
      {
        "status": "delivered",
        "count": 120,
        "revenue": 20000.0
      },
      {
        "status": "pending",
        "count": 30,
        "revenue": 5000.0
      }
    ]
  }
}
```

### 9. Search Orders (Admin)

**GET** `/search/query`

Searches orders by various criteria.

**Query Parameters:**

- `q`: Search query (order number, customer name, email)
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

### 10. Get Orders by Status (Admin)

**GET** `/stats/status/:status`

Retrieves orders filtered by specific status.

### 11. Get User Order History

**GET** `/user/:userId/history`

Retrieves detailed order history for a user with advanced filtering.

**Query Parameters:**

- `status` (optional): Filter by order status
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `page` (optional): Page number
- `limit` (optional): Items per page

## Order Statuses

- `pending`: Order placed, awaiting confirmation
- `confirmed`: Order confirmed, processing
- `processing`: Order being prepared
- `shipped`: Order shipped with tracking
- `delivered`: Order delivered successfully
- `cancelled`: Order cancelled
- `returned`: Order returned by customer

## Payment Methods

- `credit_card`: Credit card payment
- `debit_card`: Debit card payment
- `paypal`: PayPal payment
- `stripe`: Stripe payment
- `cash_on_delivery`: Cash on delivery

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Notes

- All timestamps are in ISO 8601 format
- Order numbers are auto-generated in format: `ORD-{timestamp}-{sequence}`
- Stock is automatically updated when orders are created or cancelled
- User authentication is required for most endpoints
- Admin access is required for administrative functions
