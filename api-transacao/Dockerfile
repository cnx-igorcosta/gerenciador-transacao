FROM node:8.1
WORKDIR /api-transacao
ADD . /api-transacao
RUN npm i
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]