import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongo_uri: process.env.MONGO_URI,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_password: process.env.REDIS_PASSWORD,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  client_url: process.env.CLIENT_URL,
  node_env: process.env.NODE_ENV,
  email_user: process.env.EMAIL_USER,
  mail_client_id: process.env.MAIL_CLIENT_ID,
  mail_client_secret: process.env.MAIL_CLIENT_SECRET,
  refresh_token: process.env.REFRESH_TOKEN,
};

export default config;
