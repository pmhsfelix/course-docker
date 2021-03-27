# A docker course

## Creating a container from an existing image

Start by checking the existing containers using the [`ps`](https://docs.docker.com/engine/reference/commandline/ps/) command.

```
➜  course-docker git:(main) ✗ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```
In this example, there aren't any containers. 
More precisely, there aren't any containers being managed by the Docker daemon to where the `docker` command line tools is connecting to. 

Create a container based on the `ubuntu` image, using the [`run`](https://docs.docker.com/engine/reference/commandline/run/) command.

```
docker run -td --name container-ubuntu-1 ubuntu
```

- `-d` defines a _detached_ execution,
- `--name container-ubuntu-1` defines the container name (i.e. `container-ubuntu-1`).
- `ubuntu` is the name of the image from where that container was created.

List the containers again
```
➜  course-docker git:(main) ✗ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
c88e73b5e2a3        ubuntu              "/bin/bash"         7 seconds ago       Up 5 seconds                            container-ubuntu-1
```

Run something inside the container using the [`exec`](https://docs.docker.com/engine/reference/commandline/exec/) command.

```
docker exec -ti container-ubuntu-1 bash
```

This runs `bash` inside the container and provides an interactive terminal to it
Running some commands on that terminal (e.g.  `whoami`, `pwd`, `cat /etc/os-release`, `ps -aux`) produces the following:

```
oot@c88e73b5e2a3:/# whoami
root
root@c88e73b5e2a3:/# pwd
/
root@c88e73b5e2a3:/# cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.2 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.2 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal
root@c88e73b5e2a3:/# ps -aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1   4108  3500 pts/0    Ss+  13:21   0:00 /bin/bash
root        15  0.0  0.1   4108  3620 pts/1    Ss   13:23   0:00 bash
root        25  0.0  0.1   5896  2892 pts/1    R+   13:28   0:00 ps -aux
```

That is:
- `root` on `/`.
- On an Ubuntu distribution.
- With tree processes running:
  - The `ps` process that is listing the processes.
  - The `bash` process that we executed in the container (see `exec` command).
  - The `/bin/bash` process that was created when the container started and that is PID equal to 1.

After exiting the terminal session back to the host, we can stop and remove the container.

```
root@c88e73b5e2a3:/# exit
exit
➜  course-docker git:(main) ✗ docker stop container-ubuntu-1
container-ubuntu-1
➜  course-docker git:(main) ✗ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
c88e73b5e2a3        ubuntu              "/bin/bash"         12 minutes ago      Exited (0) 4 seconds ago                       container-ubuntu-1
```

It is possible to start the container again

```
➜  course-docker git:(main) ✗ docker start container-ubuntu-1
container-ubuntu-1
➜  course-docker git:(main) ✗ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
c88e73b5e2a3        ubuntu              "/bin/bash"         13 minutes ago      Up 3 seconds                            container-ubuntu-1
```

Finally, we can stop and remove the container

```
➜  course-docker git:(main) ✗ docker stop container-ubuntu-1 && docker rm container-ubuntu-1 
container-ubuntu-1
container-ubuntu-1
➜  course-docker git:(main) ✗ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

## Creating an image

The previous example showed how to use an existing image to create containers.
In this section we will show how to create new images.

Let's start by listing all local images

```
➜  course-docker git:(main) ✗ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
```

Create a folder (e.g. src/example-0) and add the following folders to it.

`script.sh` is a bash script with commands to show characteristics of the container environment.

```
whoami

pwd

ls

cat ./file.txt

echo $evar1
```

`Dockerfile` is defined as a sequence of instructions defining the produced image.

```
# Instruction to define the base image from where to start.
FROM ubuntu

# Instruction to create a layer with the script.sh file from the build context.
COPY script.sh .

# Instruction to create a layer with the script.sh permissions changed.
RUN chmod +x script.sh

# Instruction to create a layer by running echo ...
RUN echo "Hello docker" > file.txt

# Instruction to define the default command to be run when a container is created from the image
CMD ["bash", "./script.sh"]
```

Now, let's create the image using the instructions defined in `Dockerfile`.

```
➜  course-docker git:(main) ✗ docker build -t image-example-0 src/example-0
Sending build context to Docker daemon  3.072kB
Step 1/5 : FROM ubuntu
latest: Pulling from library/ubuntu
04a5f4cda3ee: Pull complete 
ff496a88c8ed: Pull complete 
0ce83f459fe7: Pull complete 
Digest: sha256:a15789d24a386e7487a407274b80095c329f89b1f830e8ac6a9323aa61803964
Status: Downloaded newer image for ubuntu:latest
 ---> 8e428cff54c8
Step 2/5 : COPY script.sh .
 ---> Using cache
 ---> 4e86e88d624b
Step 3/5 : RUN chmod +x script.sh
 ---> Using cache
 ---> 5fcec4c573eb
Step 4/5 : RUN echo "Hello docker" > file.txt
 ---> Using cache
 ---> f98090c79a62
Step 5/5 : CMD ["bash", "./script.sh"]
 ---> Running in 47f8b4965251
Removing intermediate container 47f8b4965251
 ---> 7b4308c163bb
Successfully built 7b4308c163bb
Successfully tagged image-example-0:latest
```

- `-t image-example-0 ` defines the image name.
- `src/example-0` defines the build context, containing the `Dockerfile` and the external files used when creating the image (the `script.sh` file).

Looking into the `build` command is also instructive.

- On `Step 1/5`, the base `ubuntu` image is pulled.
- Steps 3 to 5 use temporary containers to run the associated commands. For instance, the `echo "Hello docker" > file.txt` is run on a docker container created from the image built until this step.

Listing the available images shows.
```
➜  course-docker git:(main) ✗ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
image-example-0     latest              7b4308c163bb        48 seconds ago      72.9MB
ubuntu              latest              8e428cff54c8        42 hours ago        72.9MB
```
This listing include both the `ubuntu` base image, that was fetched during the build process, as well as the newly created `image-example-0` image.

We can now run a container with this created image

```
➜  course-docker git:(main) ✗ docker run -t --name container-example-0 image-example-0
root
/
bin   dev  file.txt  lib    lib64   media  opt   root  sbin       srv  tmp  var
boot  etc  home      lib32  libx32  mnt    proc  run   script.sh  sys  usr
Hello docker
```

The lines after `docker run` are the output of the `bash ./script.sh` execution:
- The running user is `root`.
- The current directory is `/`.
- The contents of current directory shows the created `script.sh` and `file.txt`.
- The `cat ./file.txt` shows `Hello docker`.
- The `echo $evar1` doesn't show anything because that environment variable is not defined in the container.

It is possible to define environment variables when starting the container.

```
➜  course-docker git:(main) ✗ docker rm container-example-0 && docker run -t --name container-example-0 --env evar1=the-value image-example-0 bash ./script.sh
container-example-0
root
/
bin   dev  file.txt  lib    lib64   media  opt   root  sbin       srv  tmp  var
boot  etc  home      lib32  libx32  mnt    proc  run   script.sh  sys  usr
Hello docker
the-value
```

Notice how on the previous example the `container-example-0` container is removed before starting another one with the same name.

The `docker image inspect` allows us to obtain information about an image, namely the file system layers.

```
➜  course-docker git:(main) ✗ docker image inspect image-example-0 | grep RootFS -A10
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:0c78fac124da333b91fb282abf77d9421973e4a3289666bd439df08cbedfb9d6",
                "sha256:cba97cc5811c5dbdc575384d01210ab6ba3c0ff972eea20a8b7546c5767c4edb",
                "sha256:d4dfaa212623040dfb425924a30450e168a626c98b74fa2eeac360e0ceb89be1",
                "sha256:758e8bdda5bfea5392fcc207df87af5203b5fd98458c4da7ef5dbe31c09dba78",
                "sha256:758e8bdda5bfea5392fcc207df87af5203b5fd98458c4da7ef5dbe31c09dba78",
                "sha256:b74183401044d71567f37dd35e53657a4fd53b63f14422e542692e5fdf70f28a"
            ]
        },
```

Looking at the base `ubuntu` image, we notice that the first three layers are the same:

```
➜  course-docker git:(main) ✗ docker image inspect ubuntu | grep RootFS -A10
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:0c78fac124da333b91fb282abf77d9421973e4a3289666bd439df08cbedfb9d6",
                "sha256:cba97cc5811c5dbdc575384d01210ab6ba3c0ff972eea20a8b7546c5767c4edb",
                "sha256:d4dfaa212623040dfb425924a30450e168a626c98b74fa2eeac360e0ceb89be1"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
```

The three extra layers present in `image-example-0` correspond to the following three instructions in the `Dockerfile`.

```
# Instruction to create a layer with the script.sh file from the build context.
COPY script.sh .

# Instruction to create a layer with the script.sh permissions changed.
RUN chmod +x script.sh

# Instruction to create a layer by running echo ...
RUN echo "Hello docker" > file.txt
```

Each instruction runs a command that creates an additional layer with the file system changes.

This layering actually happens at the image level: an image is actually defines by a sequence of images, each corresponding to the result of the execution on top of the _parent_ image.
This is visible in the following command
```
➜  course-docker git:(main) ✗ docker image history f98090c79a62   
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
7b4308c163bb        2 hours ago         /bin/sh -c #(nop)  CMD ["bash" "./script.sh"]   0B                  
f98090c79a62        2 hours ago         /bin/sh -c echo "Hello docker" > file.txt       13B                 
5fcec4c573eb        2 hours ago         /bin/sh -c chmod +x script.sh                   45B                 
4e86e88d624b        2 hours ago         /bin/sh -c #(nop) COPY file:3fa274537758b8ee…   45B                 
8e428cff54c8        43 hours ago        /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           43 hours ago        /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           43 hours ago        /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           43 hours ago        /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B                
<missing>           43 hours ago        /bin/sh -c #(nop) ADD file:a8d2f02fbaddf8cec…   72.9MB
```

If we do the same for the base `ubuntu` image we get

```
➜  course-docker git:(main) ✗ docker image history ubuntu         
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
8e428cff54c8        43 hours ago        /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           43 hours ago        /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           43 hours ago        /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           43 hours ago        /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B                
<missing>           43 hours ago        /bin/sh -c #(nop) ADD file:a8d2f02fbaddf8cec…   72.9MB
```

The `image-example-0` is defined by a chain of 9 images, composed by:
- The chain of 5 images that define the `ubuntu` image.
- The additional chain of four images, that we created by the steps defined by the `Dockerfile`.

This chain implemented via a `Parent` property, present in the image metadata.
For instance, getting the parent for `image-example-0`
```
➜  course-docker git:(main) ✗ docker image inspect image-example-0 | grep Parent    
        "Parent": "sha256:f98090c79a6294eaa56f4bd53669a923d8d6816c99d0dc9993172defde6c32bd",
```
we the ID of the second last image.
Getting the parent of this image produces the third last image ID

```
course-docker git:(main) ✗ docker image inspect f98090 | grep Parent
        "Parent": "sha256:5fcec4c573ebff13e33eee0a4f0187ddced6964574f505055f28feba111bea2f",
```

## Creating an image with a Node.js server

The server source file.

```
const http = require('http');

const host = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, host, () => {
  console.log(`Server running at ${host}:${port}`);
});
```
Note that the server is listening on `0.0.0.0` and not on the loopback interface only.

The `Dockerfile`.

```
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
```

Building the image.

```
➜  course-docker git:(main) ✗ docker build -t image-example-1 src/example-1                        
Sending build context to Docker daemon  3.072kB
Step 1/6 : FROM alpine
 ---> 302aba9ce190
Step 2/6 : WORKDIR /usr/src/app
 ---> Using cache
 ---> 5e8c2d7ab382
Step 3/6 : RUN apk update && apk add nodejs
 ---> Using cache
 ---> aae66d50d3e2
Step 4/6 : COPY index.js ./
 ---> 75f2cc200d9b
Step 5/6 : EXPOSE 8080
 ---> Running in a8e12592206b
Removing intermediate container a8e12592206b
 ---> 21d352ac5dac
Step 6/6 : CMD [ "node", "index.js" ]
 ---> Running in 5f7dd9e8551c
Removing intermediate container 5f7dd9e8551c
 ---> 3b79e19eb570
Successfully built 3b79e19eb570
Successfully tagged image-example-1:latest
```

Starting a container with the built image, mapping the `8000` port in the host to the `8080` port in the container.

```
➜  course-docker git:(main) ✗ docker run --name container-example-1 -d -p 8000:8080 image-example-1
8b7511d6a73956b14d62bfa691e4a448ab6897a226d5171052d0db87de379461
➜  course-docker git:(main) ✗ docker logs container-example-1
Server running at 0.0.0.0:8080
➜  course-docker git:(main) ✗ curl http://localhost:8000
Hello World%                              
```

The command `docker logs container-example-1` provides visibility on output of `node index.js`.

The command `curl http://localhost:8000` performs a request to the server running inside the container. 
Notice that the port in the request URI is the host port.
