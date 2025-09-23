import { config } from 'dotenv';
config();

const envConfig = () => ({
  database: process.env.MONGO_URI || 'mongodb://mongo:27017/todo-app',
  PORT: parseInt(process.env.PORT || '3000', 10),
});

export default envConfig;
