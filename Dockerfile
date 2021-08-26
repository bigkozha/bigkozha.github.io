FROM node:latest
EXPOSE 3000
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]