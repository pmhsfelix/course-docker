# Start from the alpine base image.
# (see https://hub.docker.com/_/alpine)
FROM alpine

# Define the workdir in the container.
WORKDIR /usr/src/app

# Install node JS.
RUN apk update && apk add nodejs

# Copy the javacript source file.
COPY index.js ./

# Document the ports that are used.
EXPOSE 8080

# Start the app.
CMD [ "node", "index.js" ]
