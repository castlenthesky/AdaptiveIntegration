import * as dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envConfig = dotenv.config();

if (!envConfig) {
  throw new Error("Unable to find .env file.");
}

export default {
  app: {
    url: process.env.APPURL || "localhost",
    port: process.env.PORT || 4000,
  },
  adaptive: {
    endpoint: process.env.ADAPTIVE_ENDPOINT || "adaptive_endpoint",
    username: process.env.ADAPTIVE_USERNAME || "adaptive_username",
    password: process.env.ADAPTIVE_PASSWORD || "adaptive_password",
  },
};
