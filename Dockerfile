# React app
FROM node:16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

COPY src/@interact/ /app/src/@interact/
COPY src/@jumbo/ /app/src/@jumbo/


RUN npm install --legacy-peer-deps
COPY . ./
EXPOSE 3000
CMD ["npm", "start"]