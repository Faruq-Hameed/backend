# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the app port (can be adjust if necessary)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main.js"]
