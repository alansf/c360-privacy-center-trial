'use strict';

const { index:processController } = require('../controllers/process');

const oauthRouter = require('./oauth');
const salesforceBridgeRouter = require('./bridge/salesforce-bridge');
const abortHandler = require('../controllers/abort');
const connectorAuthMiddleware = require('./middleware/connector-auth');

// The route definitions here are kinda all jumbled up in their code organization. Some are in the route, some are in controllers etc.

function init(server) {

    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.get('/', async (req, res) => {
        console.log(`Found`);
        res.send('Found');
        res.status(200);
        res.end();
    });

    server.use('/oauth2', oauthRouter);

    server.post('/process', processController);

    server.post('/abort', abortHandler);

    // Import salesforce subroutes for calling SF model class methods
    server.use('/salesforce', connectorAuthMiddleware, salesforceBridgeRouter);

    server.use('/app', connectorAuthMiddleware, require('./app'));

}

module.exports = {
    init
};