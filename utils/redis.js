const redis = require('redis');
//Represents a Redis client.

class RedisClient {
    //Creates a new RedisClient instance.
    constructor() {
        this.client = redis.createClient();

        this.client.on('error', (error) => {
            console.error('Redis Error:', error);
        });
    }

    //Checks if this client's connection to the Redis server is active.
	isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    //Stores a key and its value along with an expiration time.
	async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply === 'OK');
                }
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply === 1);
                }
            });
        });
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;
