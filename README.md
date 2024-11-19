<h1 align="center"> GOV Authentication API Application</h1>

<h2 align="center">Getting Started</h2>



### 1. Create .env file

In the server directory, create a .env file with the following contents:

```bash
MONGODB_URI=[your MongoDB connection string]
COOKIE_SECRET=[your cookie secret string]
```

Replace [your MongoDB connection string] with the connection string for your MongoDB instance (e.g., mongodb://localhost:27017/mydatabase if using a local MongoDB server).

Replace [your cookie secret string] with a secure string for signing cookies.

### 2. After setting up mongoDB on your desktop or laptop to run MongoDB (the database) on the application


```bash
cd server
[your MongoDB startup command: <path_to_mongodb>/bin/mongod --dbpath <path_to_data_directory>
]
```

<path_to_mongodb> should be replaced with the path to the directory where MongoDB is installed on your system.
<path_to_data_directory> should be replaced with the path to the directory where you want MongoDB to store its data files.


### 3. Set up and run the backend
in a separate terminal:

```bash
cd server
npm install --force
node server.js  

or 

npm run start
```

Access the authetication api at http://localhost:3000.

Access the JSON data of users including their sessions at http://localhost:3000/api/users.