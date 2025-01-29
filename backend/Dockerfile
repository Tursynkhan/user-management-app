FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
