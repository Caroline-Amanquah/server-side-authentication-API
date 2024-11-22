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


### 2. Set Up and Run MongoDB

After installing MongoDB on your desktop or laptop, configure it to run by starting the database using the following steps:

```bash
➜  authentication-api git:(main) ✗ [your MongoDB startup command: <path_to_mongodb>/bin/mongod --dbpath <path_to_data_directory>
]
```

- Replace <path_to_mongodb> with the installation path of MongoDB on your system.
- Replace <path_to_data_directory> with the directory path where you want MongoDB to store its data files. Ensure this directory exists before running the command.

This will ensure that MongoDB is ready to be used on your system.

### 3. Set up and run the application

Open a new terminal and then execute the following commands:

1. Install the project dependencies:

```bash
npm install 
```

If you encounter issues with npm install, try using the --force flag:

```bash
npm install --force
```

2. Start the server:

```bash
node server.js
```

Alternatively, you can use the npm script (if defined in package.json):

```bash
npm run start
```

Access the application at <http://localhost:3000>.

Access the JSON data of users including their sessions at <http://localhost:3000/api/users>.
