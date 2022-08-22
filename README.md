# boot4go-DockerUI
A visual management tools for docker container and docker swarm cluster, You can browse and maintain the docker single node 
or cluster node both worker and Manager.

![license](https://img.shields.io/badge/license-Apache--2.0-green.svg)

## INTRO
*DockerUI* is an easy-to-use and lightweight docker management tool. Through the operation of the web interface, it is more 
convenient for users unfamiliar with docker instructions to enter the docker world faster.

*DockerUI* has an easy-to-use interface. It does not need to remember docker instructions. Just download the image 
And you can immediately join and complete the deployment. Based on the features of docker, the version of the image can 
be directly updated in docker UI. With the same settings, the upgrade can be completed by redeploying and replacing the 
riginal container, and the functions of the latest version can be used.

*DockerUI* covers more than 95% of the command functions of the docker cli command line. Through the visual operation function 
provided in the dockerui interface, the management and maintenance functions of the docker environment and the docker swarm 
cluster environment can be easily performed.

*DockerUI* is a visual graphical management tool for docker container images. Dockerui can be used to easily build, manage 
and maintain the docker environment. It is completely open-source and free. It is based on the container installation method, 
which is convenient and efficient for deployment.

Our primary goals are:
You can use Docker UI to manage the docker and swarm instance more easy.

Official site: https://github.com/gohutool/docker.ui

![image](https://img-blog.csdnimg.cn/80904917c49d4a1ca8e4da6d9d1ee656.png)

## Feature

- *Docker host managementmanagement*
  Data volume management, image management, container management, build management, warehouse configuration management, network configuration management

- *Docker swarm cluster management*
  Cluster profile information, node management, service management, task management, password management, configuration management

- *Task arrangement*
  Docker task scheduling, docker swarm task scheduling

## Snapshot

### Home page (summary)
![image](https://img-blog.csdnimg.cn/46f6144e1f2b4562bc6c55b98d19b018.png)

### Image list
![image](https://img-blog.csdnimg.cn/c2161006901e4ee7bee132dc1271bc44.png)

### Search repository / pull image
![image](https://img-blog.csdnimg.cn/97519b029c8d4910bd21401e271f2b71.png)

### Build Image
![image](https://img-blog.csdnimg.cn/b23fdb3c295e4ecdbaa3904cc79e7c8b.png)

### Export / Import Image
![image](https://img-blog.csdnimg.cn/ebcf17ec4203495bafe6e599da9891fc.png)

### Push Image
![image](https://img-blog.csdnimg.cn/c8e55811bc234ed9893cc8f9f1ba4a5a.png)

#### Execute Image
![image](https://img-blog.csdnimg.cn/4c25eaeaa7b14d07838cf10c04ead5fd.png)

### List Container
![image](https://img-blog.csdnimg.cn/c6fe99139d654eed885748d5c86070b1.png)

### Web Console of Container
![image](https://img-blog.csdnimg.cn/28ec5d0ce20945db9908153d7090ac77.png)

### Container File System
![image](https://img-blog.csdnimg.cn/b464d6d70e534b4087ab67cd4a381f27.png)

### Stats of Container
![image](https://img-blog.csdnimg.cn/f34cef2f67e442b09e1cdf31a6907f07.png)

### List processes of Container
![image](https://img-blog.csdnimg.cn/a4204e7673294ed1bb01a03798beb823.png)

### Export file from Container
![image](https://img-blog.csdnimg.cn/a4204e7673294ed1bb01a03798beb823.png)

### Export file from Container
![image](https://images.gitee.com/uploads/images/2022/0530/104343_11e0da56_6575697.png)

### Network Management
![image](https://img-blog.csdnimg.cn/09f53d750e054911876cf7f1b44da520.png)

### Swarm Cluster Management
![image](https://img-blog.csdnimg.cn/b8ee779df1e141968042be7a77c7bbf6.png)

### Create Service
![image](https://img-blog.csdnimg.cn/842d0e8f5b3f4f3c968c5b7ca099cd8d.png)

### Task Management
![image](https://img-blog.csdnimg.cn/ac521683f92a4b1098fb87d93d66c134.png)

### List Task
![image](https://img-blog.csdnimg.cn/d7684158e28c42eb830d33180fa86be4.png)

### Docker Compose
![image](https://img-blog.csdnimg.cn/45e6e9185a9a4ac4888f90130547d93f.png)


## Installation and Getting Started

### From Github
- Download sourcecode from github website, visit https://github.com/gohutool/docker.ui .
- Install the golang runtime environment.
- Come into the project directory
- Run command as blow;
  - export GO111MODULE=on 
  - export GOPROXY="https://goproxy.cn,direct"
  - go mod tidy
  - go mod download
  - go build -o server .
- Run ./server command to start

### From hub.docker.com
- pull image from hub
  - docker image pull joinsunsoft/docker.ui
- start container with image, and publish 8999 port to your port
  - docker container run --rm --name docker.ui -v /var/run/docker.sock:/var/run/docker.sock -p 8999:8999 joinsunsoft/docker.ui

## Visit the browser tool
- Now, you can visit like as http://192.168.56.102:8999 .
- Default Username/Password ginghan/123456
- Enjoy it now.