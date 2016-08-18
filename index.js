var shared = {
    PGClient:require('./scripts/pg/client'),
    PGAgent:require('./scripts/pg/agent'),
    Document:require('./scripts/document'),
    Save:require('./scripts/save'),
    Project:require('./scripts/project')
};

module.exports = shared;
