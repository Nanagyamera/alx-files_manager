const crypto = require('crypto');
const dbClient = require('../utils/db');

const UsersController = {
    postNew: async (req, res) => {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        // Check if email already exists
        const existingUser = await dbClient.client
            .db()
            .collection('users')
            .findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Already exists' });
        }

        // Hash the password
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        // Create new user object
        const newUser = {
            email,
            password: hashedPassword
        };

        // Insert user into DB
        const result = await dbClient.client
            .db()
            .collection('users')
            .insertOne(newUser);

        // Return the new user with minimal information
        const insertedUser = {
            id: result.insertedId,
            email
        };

        res.status(201).json(insertedUser);
    }
};

module.exports = UsersController;
