const fs = require('fs');
const path = require('path');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

const FilesController = {
    postUpload: async (req, res) => {
        const token = req.headers['x-token'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const redisKey = `auth_${token}`;
        const userId = await redisClient.get(redisKey);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type, parentId, isPublic, data } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }

        if (!type || !['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: 'Missing type' });
        }

        if (type !== 'folder' && !data) {
            return res.status(400).json({ error: 'Missing data' });
        }

        if (parentId) {
            const parentFile = await dbClient.client
                .db()
                .collection('files')
                .findOne({ _id: dbClient.client.db().ObjectId(parentId) });

            if (!parentFile) {
                return res.status(400).json({ error: 'Parent not found' });
            }

            if (parentFile.type !== 'folder') {
                return res.status(400).json({ error: 'Parent is not a folder' });
            }
        }

        let localPath = '';
        if (type !== 'folder') {
            localPath = path.join(FOLDER_PATH, `${uuidv4()}`);
            const fileContent = Buffer.from(data, 'base64');
            fs.writeFileSync(localPath, fileContent);
        }

        const newFile = {
            userId: dbClient.client.db().ObjectId(userId),
            name,
            type,
            isPublic: isPublic || false,
            parentId: parentId || 0,
            localPath: localPath || null
        };

        const result = await dbClient.client
            .db()
            .collection('files')
            .insertOne(newFile);

        return res.status(201).json({ ...newFile, _id: result.insertedId.toString() });
    }
};

module.exports = FilesController;
