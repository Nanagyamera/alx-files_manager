const crypto = require('crypto');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const AuthController = {
    getConnect: async (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        const user = await dbClient.client
            .db()
            .collection('users')
            .findOne({ email, password: hashedPassword });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const redisKey = `auth_${token}`;

        await redisClient.set(redisKey, user._id.toString(), 24 * 60 * 60); // 24 hours expiration

        return res.status(200).json({ token });
    },

    getDisconnect: async (req, res) => {
        const token = req.headers['x-token'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const redisKey = `auth_${token}`;
        const userId = await redisClient.get(redisKey);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(redisKey);

        return res.status(204).send();
    }
};

module.exports = AuthController;
