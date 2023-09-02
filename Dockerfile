FROM node:19-alpine

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

RUN mkdir /app/public/files

CMD ["npm", "run", "start:prod"]
