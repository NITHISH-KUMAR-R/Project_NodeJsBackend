# Dockerfile for Node.js App

# Use the official Node.js image.
FROM node:16

# Create and set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD [ "node", "app.js" ]
