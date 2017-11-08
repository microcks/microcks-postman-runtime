FROM node:boron-alpine

MAINTAINER Laurent Broudoux <laurent.broudoux@gmail.com>

# Define working directory
RUN mkdir -p /opt/app-root/src && mkdir -p /opt/app-root/src/lib
WORKDIR /opt/app-root/src

# Copy files and install dependencies
COPY /* /opt/app-root/src/
COPY /lib/* /opt/app-root/src/lib/
RUN npm install

# Set the running environment as production
ENV NODE_ENV production
ENV LOG_LEVEL info
ENV PORT 3000

# Expose on specified network port
EXPOSE 3000

# Executing defaults
CMD ["node", "app.js"]
