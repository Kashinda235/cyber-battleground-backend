# /backend/Dockerfile
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Express app runs on (e.g., 5000)
EXPOSE 8000

# Command to run your backend
CMD ["npm", "run", "dev"]