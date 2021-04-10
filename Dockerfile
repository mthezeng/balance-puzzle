# pull official base image
FROM node:alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g
RUN npm install --save bootstrap
RUN npm install --save reactstrap react react-dom
RUN npm install react-beautiful-dnd --save

# add app
COPY . ./

# start app
CMD ["npm", "start"]