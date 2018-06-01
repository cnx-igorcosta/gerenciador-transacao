FROM node:8.1
WORKDIR /worker-transacao
ADD . /worker-transacao
RUN npm i
RUN npm run build
CMD ["npm", "start"]