FROM node:8.1
WORKDIR /api-foo
ADD . /api-foo
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]