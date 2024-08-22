# Blog Application

This application is a blog platform that allows users to create, read, update, and delete (CRUD) blog posts. It features a RESTful API built with Node.js and Express.js, with a frontend built using React. Users can also register, log in, and manage their profiles, including changing their avatars. The application includes additional features like filtering posts by category or author and handling comments for each blog post.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)

### Features

- **User Authentication:**
  - JWT-based authentication for secure access.
  - Register, login, and update user profile details.
  - Change user avatars.
- **Blog Posts:**
  - Create, read, update, and delete blog posts.
  - Filter posts by category and author.
  - View posts by a specific user.
- **Commenting System:**
  - Backend support for adding comments to posts (Frontend implementation in progress).
- **Additional Functionalities:**
  - Secure API endpoints with proper error handling.
  - Basic frontend with React using React Hooks and React Router.

### Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Mongoose (MongoDB ORM)
  - JSON Web Tokens (JWT) for authentication
  - Bcrypt for password hashing
- **Frontend:**
  - React
  - React Router for routing
  - Axios for API calls

### Installation

**Clone the repository:**

```
git clone https://github.com/Arunmani21/Blog
```

**Installing Dependencies:**

For Server Side

```
cd server
npm install
```

For Client Side

```
cd client
npm install
```

**Running Commands:**

Run command for server :

```
npm run dev
```

Run command for client :

```
npm start
```

### API Endpoints

#### User Routes:

- **POST** `/register`: Register a new user.
- **POST** `/login`: Log in a user.
- **GET** `/:id`: Retrieve user details by ID.
- **POST** `/change`: Change user avatar (requires authentication).
- **GET** `/`: Get a list of all authors.
- **PUT** `/edit-user`: Edit user details (requires authentication).

#### Post Routes:

- **POST** `/`: Create a new post (requires authentication).
- **GET** `/`: Retrieve all posts.
- **GET** `/:id`: Retrieve a single post by ID.
- **PUT** `/:id`: Edit a post by ID (requires authentication).
- **GET** `/categories/:category`: Get posts by category.
- **GET** `/users/:id`: Get posts by user.
- **DELETE** `/:id`: Delete a post by ID (requires authentication).

### Frontend

The frontend is built with React and implements a basic user interface to interact with the API. It includes forms for creating and editing blog posts, user registration, and login.
