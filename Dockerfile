# Use the official Node.js image as the base (using specific version for stability)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app source code to the container
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]  