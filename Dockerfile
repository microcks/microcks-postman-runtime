FROM node:12-alpine

MAINTAINER Laurent Broudoux <laurent@microcks.io>

# Some version information
LABEL io.k8s.description="Microcks is Open Source Kubernetes native tool for API Mocking and Testing" \
      io.k8s.display-name="Microcks Postman Runtime" \
      maintainer="Laurent Broudoux <laurent@microcks.io>"

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
