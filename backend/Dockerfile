FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
# CMD ["node", "index.js"]
CMD ["npx", "nodemon", "index.js", "--legacy-watch"]