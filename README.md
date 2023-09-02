FILE MANAGER

File Manager is a web application that provides file management and storage functionalities. It allows users to create, upload, organize, and manage files and folders. The application also includes features like user authentication, access control, and background processing for tasks like thumbnail generation and sending welcome emails to new users.

USAGE
File Manager allows users to manage their files and folders through a user-friendly web interface. Users can create new accounts, upload files, organize them into folders, and control access to their files. The application also supports background processing for tasks like thumbnail generation and sending welcome emails.

Endpoints

Redis and MongoDB Clients

utils/redis.js contains the RedisClient class, which handles connections to Redis. It includes methods like isAlive, get, set, and del.

utils/db.js contains the DBClient class, which connects to MongoDB. It provides methods like isAlive, nbUsers, and nbFiles.

Express Server

server.js initializes the Express server, which listens on the port defined by the PORT environment variable (default: 5000).

routes/index.js defines the following API endpoints:

GET /status: Returns the status of Redis and MongoDB.

GET /stats: Returns statistics about users and files.

POST /users: Creates a new user in the database.

GET /connect: Signs in a user by generating an authentication token.

GET /disconnect: Signs out a user based on the token.

GET /users/me: Retrieves the user based on the token.

POST /files: Creates a new file in the database and on disk.

GET /files/:id: Retrieves a file based on its ID.

GET /files: Retrieves a list of files with pagination.

PUT /files/:id/publish: Sets a file's isPublic attribute to true.

PUT /files/:id/unpublish: Sets a file's isPublic attribute to false.

GET /files/:id/data: Retrieves file content based on its ID and optional size parameter.

LICENSE

This project is licensed under the MIT License.
