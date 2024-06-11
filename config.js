module.exports = {
    mongodb: {
        server: '127.0.0.1',
        port: 27017,
        ssl: false,
        sslValidate: false,
        autoReconnect: true,
        poolSize: 4,
        admin: true,
        auth: [
        {
            database: 'admin',
            username: 'root',
            password: 'example'
        }
        ],
        adminUsername: 'root',
        adminPassword: 'example'
    },
    site: {
        baseUrl: '/',
        cookieKeyName: 'mongo-express',
        cookieSecret: 'cookiesecret',
        host: '0.0.0.0',
        port: 8081,
        requestSizeLimit: '50mb',
        sessionSecret: 'sessionsecret'
    }
};