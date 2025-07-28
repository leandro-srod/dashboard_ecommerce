### E-commerce Dashboard

**[Português](README.pt.md)** | English

This is an e-commerce dashboard project, developed for efficient product management.
It allows you to view, add, edit, and delete products, including managing their images.

### Technologies Used
This project was built with the following technologies:

### Frontend:
- React: JavaScript library for building user interfaces.
- Vite: An extremely fast frontend bundler and development tool, used to optimize the development and build process.
- React Router DOM: For routing and navigation between pages.
- React-Bootstrap: React components built with Bootstrap for responsive and rapid development.
- Axios: HTTP client for making requests to the backend API.

### Backend:
- Node.js: JavaScript runtime environment.
- Express.js: Web framework for Node.js, used to build the RESTful API.
- Mongoose: ODM (Object Data Modeling) for MongoDB, facilitating interaction with the database.
- Multer: Node.js middleware, used to handle file uploads.
- Cloudinary: Cloud image management service, used as an image database and for media processing. The Cloudinary SDK is integrated into the backend to facilitate image upload, deletion, and transformation operations.
- Dotenv: For loading environment variables from a .env file.

### Database:
- MongoDB Atlas: Cloud-based NoSQL database.

### Features
- Product Listing: View all registered products in the system, including their images.
- Detailed Product View: Access specific information about each product and its images.
- Product Registration: Add new products with all their details and upload multiple images, which are stored in Cloudinary.
- Product Editing: Update existing product information and manage their images (add new images to Cloudinary and delete existing images from Cloudinary).
- Product Deletion: Remove products from the system, which also triggers the deletion of their corresponding images in Cloudinary.

### API Routes (Backend)
- GET /produtos: Lists all products.
- GET /produtos/:id: Returns a specific product by ID.
- POST /produtos: Registers a new product with images (multipart/form-data). Images are sent to Cloudinary.
- PUT /produtos/:id: Updates an existing product (including adding new images to Cloudinary).
- DELETE /produtos/:id: Deletes a product and its corresponding images from Cloudinary.
- DELETE /produtos/:id/imagens/:publicId: Deletes a specific image of a product from Cloudinary.

### Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/ (Cloudinary, DB configurations)
│   │   ├── controllers/ (business logic for routes)
│   │   ├── middlewares/ (image upload with Multer)
│   │   ├── models/ (Mongoose schemas)
│   │   ├── routes/ (API route definitions)
│   │   └── app.js (main Express configuration)
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/ (images, icons)
│   │   ├── components/ (reusable components like Header, Cards)
│   │   ├── pages/ (specific pages like ProductRegistration, ProductEditing)
│   │   ├── services/ (API connection)
│   │   ├── App.js (main component)
│   │   ├── index.js (React rendering)
│   │   └── App.css (global/custom styles)
│   ├── .gitignore
│   ├── .eslint.config.js
│   ├── .index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
└── README.md
````

### Contribution

- Feel free to contribute to the project!