const redis = require('redis');

// Create a Redis client
class RedisClient {
  constructor() {
    // Initialize the Redis client
    this.client = redis.createClient();

    // Handle Redis client errors
    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  /**
   * Check if the connection to Redis is alive.
   * @returns {Promise<boolean>} - True if the connection is successful, false otherwise.
   */
  async isAlive() {
    return new Promise((resolve) => {
      // Check if the client is connected to Redis
      this.client.ping((error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Get the value stored in Redis for a given key.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} - The Redis value or null if not found.
   */
  async get(key) {
    return new Promise((resolve) => {
      this.client.get(key, (error, value) => {
        if (error) {
          console.error('Redis GET error:', error);
          resolve(null);
        } else {
          resolve(value);
        }
      });
    });
  }

  /**
   * Set a value in Redis with an expiration duration.
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to store in Redis.
   * @param {number} duration - The duration in seconds for the expiration.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    return new Promise((resolve) => {
      this.client.setex(key, duration, value, (error) => {
        if (error) {
          console.error('Redis SET error:', error);
        }
        resolve();
      });
    });
  }

  /**
   * Delete a value from Redis for a given key.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    return new Promise((resolve) => {
      this.client.del(key, (error) => {
        if (error) {
          console.error('Redis DEL error:', error);
        }
        resolve();
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();

module.exports = redisClient;
