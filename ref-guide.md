# Quick reference guide

* [`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`](https://docs.docker.com/engine/reference/commandline/run/)
  * Creates and starts a container based on the provided image.
  * E.g. `docker run --name the-container-name the-image-name`
  * `-d` - detached.
  * `-t` - Allocate a pseudo-TTY.

* [`docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`](https://docs.docker.com/engine/reference/commandline/exec)
  * Runs a command inside a running container.
  * E.g. `docker exec the-container-name bash`

* [`docker build [OPTIONS] PATH | URL | -`](https://docs.docker.com/engine/reference/commandline/build/)
  * Builds a container from an environment and a Dockerfile (typically contained in the environment).