const config = {
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DB_NAME,
};

module.exports = { config };
