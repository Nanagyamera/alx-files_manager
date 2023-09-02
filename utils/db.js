const { MongoClient } = require('mongodb');

// Configuration options for the MongoDB connection
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a MongoDB client
class DBClient {
  constructor() {
    // MongoDB connection URL
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${dbHost}:${dbPort}`, mongoOptions);

    // Connect to MongoDB
    this.client.connect()
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => console.error('MongoDB connection error:', error));
  }

  /**
   * Check if the connection to MongoDB is alive.
   * @returns {boolean} - True if the connection is successful, false otherwise.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Get the number of documents in the 'users' collection.
   * @returns {Promise<number>} - The number of user documents in the collection.
   */
  async nbUsers() {
    const usersCollection = this.client.db().collection('users');
    return usersCollection.countDocuments();
  }

  /**
   * Get the number of documents in the 'files' collection.
   * @returns {Promise<number>} - The number of file documents in the collection.
   */
  async nbFiles() {
    const filesCollection = this.client.db().collection('files');
    return filesCollection.countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();

module.exports = dbClient;
