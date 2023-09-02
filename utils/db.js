const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPort = process.env.DB_PORT || 27017;
        const dbName = process.env.DB_DATABASE || 'files_manager';

        const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;

        this.client = new MongoClient(uri, { useUnifiedTopology: true });

        this.isAlive = false;

        this.connect();
    }

    async connect() {
        try {
            await this.client.connect();
            this.isAlive = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB Connection Error:', error);
        }
    }

    async nbUsers() {
        const usersCollection = this.client.db().collection('users');
        return usersCollection.countDocuments();
    }

    async nbFiles() {
        const filesCollection = this.client.db().collection('files');
        return filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();

module.exports = dbClient;
