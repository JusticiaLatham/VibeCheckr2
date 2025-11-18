FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server ./server

# Expose port
EXPOSE 5001

# Start server
WORKDIR /app
CMD ["node", "server/index.js"]

