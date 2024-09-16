# Use an official Node.js runtime as a parent image
FROM node:20.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8000"]
