# Use the Node.js 14 image
FROM node:14

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (assuming this command builds the frontend)
RUN npm run build

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 3002

# Command to start the application
CMD ["npm", "start"]