FROM node:8.1
WORKDIR /api-fighters
ADD . /api-fighters
RUN npm i
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]