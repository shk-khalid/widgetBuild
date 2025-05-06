# 1. Use Node 20 base image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json files first to use cached layer
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Expose port (Vite default is 5173, but we’ll map it to 3000)
EXPOSE 3000

# 7. Start dev server
CMD ["npm", "run", "dev"]
