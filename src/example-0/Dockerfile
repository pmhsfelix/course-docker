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
