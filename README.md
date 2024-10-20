# Product Tracking Backend - README

This project is a backend system for product tracking, built using **Node.js**, **Express.js**, and **MongoDB**. The system provides a RESTful API to manage products, including adding, updating, viewing, and deleting product details.

## Project Overview

The backend system supports the following operations:
- **Create a Product**: Add a new product with details like name, SKU, status, and location.
- **Retrieve Products**: Fetch all products or specific products by their ID.
- **Update Product Information**: Modify the details of an existing product.
- **Delete Products**: Remove products from the system.

### Features
- **RESTful API**: Provides endpoints for CRUD operations (Create, Read, Update, Delete) on products.
- **MongoDB Integration**: Uses **Mongoose** for database interactions with MongoDB.
- **Error Handling**: Implements middleware for consistent error handling and response formatting.
- **Data Validation**: Utilizes **Joi** or **Express Validator** for validating incoming request data.
- **Modular Architecture**: Follows the MVC (Model-View-Controller) pattern for a clean and maintainable codebase.

## Getting Started

### Prerequisites

To run the project locally, you will need:
- **Node.js** and **npm** installed on your machine.
- **MongoDB** installed locally or accessible via a cloud service (e.g., MongoDB Atlas).
- A tool like **Postman** or **cURL** to test API requests.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/product-tracking-backend.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd product-tracking-backend
    ```

3. **Install the dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**:
    Create a `.env` file in the root directory with the following configuration:
    ```bash
    PORT=8000
    DB_URL=mongodb://localhost:27017/product-tracking
    ```

5. **Run the development server**:
    ```bash
    npm run dev
    ```

    The server will start on `http://localhost:8000`.

### API Endpoints

| HTTP Method | Endpoint             | Description                        |
|-------------|----------------------|------------------------------------|
| GET         | `/api/products`       | Fetch all products                 |
| GET         | `/api/products/:id`   | Fetch a product by its ID          |
| POST        | `/api/products`       | Add a new product                  |
| PUT         | `/api/products/:id`   | Update an existing product         |
| DELETE      | `/api/products/:id`   | Delete a product                   |

### Sample API Usage

1. **Create a product**:
    - Endpoint: `POST /api/products`
    - Request Body (example):
      ```json
      {
        "name": "Product A",
        "sku": "A001",
        "status": "in_stock",
        "location": "Warehouse 1"
      }
      ```

2. **Fetch all products**:
    - Endpoint: `GET /api/products`

3. **Fetch a product by ID**:
    - Endpoint: `GET /api/products/:id`

4. **Update a product**:
    - Endpoint: `PUT /api/products/:id`
    - Request Body (example):
      ```json
      {
        "status": "out_of_stock"
      }
      ```

5. **Delete a product**:
    - Endpoint: `DELETE /api/products/:id`

### Database Setup

This project uses **MongoDB** for data storage. Make sure MongoDB is installed and running locally on your machine or use MongoDB Atlas for cloud-based storage. The connection URL for the database should be provided in the `.env` file as `DB_URL`.

Example:
```bash
DB_URL=mongodb://localhost:27017/product-tracking
```

### Running the Project

1. Start the MongoDB service (if running locally).
2. Run the development server:
    ```bash
    npm run dev
    ```
3. The API will be available at `http://localhost:8000`.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing product data.
- **Mongoose**: ODM for interacting with MongoDB.
- **dotenv**: For environment variable management.
- **Joi** or **Express Validator**: For input validation.

## Contributing

If you want to contribute to the project, feel free to fork the repository, make changes, and submit a pull request. Contributions in the form of bug fixes, feature improvements, or general feedback are always appreciated.

---

Enjoy building and tracking products!