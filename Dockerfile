FROM node
WORKDIR /app
COPY package.json .
COPY package* .
RUN npm install
COPY . .
CMD [ "npm" , "start"]


