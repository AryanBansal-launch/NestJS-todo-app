import { config } from 'dotenv';
config();
const envConfig = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs-todo',
  });
  
  export default envConfig;
  