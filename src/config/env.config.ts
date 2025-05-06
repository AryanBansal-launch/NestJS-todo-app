import {config} from 'dotenv';
config();

const envConfig = () => ({
    database: process.env.DATABASE_URL || '',
    PORT: parseInt(process.env.PORT || '3000',10)
  });
  
  export default envConfig;