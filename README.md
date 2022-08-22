# boot4go-DockerUI
A visual management tools for docker container and docker swarm cluster, You can browse and maintain the docker single node or cluster node both worker and Manager.

![license](https://img.shields.io/badge/license-Apache--2.0-green.svg)

## INTRO
*DockerUI* is a highly available and consistent service discovery repository.  The graphical management tool etcdv3 browser 
used to manage etcd. At present, there is no bright product in the unified view of the management tool 
products of etcd. This etcdv3 browser is unique.

Our primary goals are:
You can use Etcdv3 browser to manage the etcd instance more easy.

## Feature

- It supports the collection management according to the prefix. Logically, according to the prefix rules, you can manage the key value team like the management table, which is the same as the management tool of most key value databases, redis.
- The multi-dimensional query function can query the key values in the key value library through the visual query tool, and directly maintain the key value pairs in the visual management tool
- Visual lease management. Lease is a feature of etcd that has a wide range of uses and uses many scenarios. Through the function of lease, we can customize many unique functions for our distributed clusters. Etcdv3 browser can query, maintain and manage lease visually. Through the visual interface, we can easily query lease, view relevant key value pairs of lease and view lease details, And cancel and renew the lease
- Query, maintenance and management of distributed locks. Etcd realizes the strong consistency distributed lock of raft based on the underlying etcd, which is also a very powerful and practical feature in the application of etcd. However, etcd does not have the interface and function to maintain the lock information. Through the integration of etcv3 browser and etcd4go, it can visually monitor the, request, lock and release status of distributed locks in etcd instances, And visual management and maintenance.
- Etcv3 browser supports multi instance connection. In the visual interface, connect multiple different instances for management and maintenance.

## Snapshot

### Login
![image](https://img-blog.csdnimg.cn/6b559653242f4bf2b0331ca3f4b42cc9.png)

### Supports multi instance connection management and supports adding data sources in various ways, including import and replication.
![image](https://images.gitee.com/uploads/images/2022/0524/103654_e681c5c5_6575697.png)
![image](https://img-blog.csdnimg.cn/a333124c639e42088be8945072a1d691.png)

### Collection management and query, according to the naming rules of prefixes, are gathered in a collection for statistical management. The collection can be divided into more detailed levels according to the directory. The structure is clear and the management is more convenient
![image](https://img-blog.csdnimg.cn/a65da6d5347949fdb58e35c6a58de18f.png)

### The multi-dimensional query function supports the query, filtering, page turning and sorting of multi-dimensional data. It is as convenient as querying tables in database management tools. Etcd management tool, which supports query and page turning, is now this tool
![image](https://img-blog.csdnimg.cn/ebbea99207124e3593799c08ed1109a5.png)

### Visual lease management has a wide range of usage scenarios, but there is no good tool for management. Well, now there are, and the key is convenient. Directly view the lease details and associated key value pairs
![image](https://img-blog.csdnimg.cn/b1834e22e3124944b4c0ea83ed71955f.png)

### For the management of distributed locks with exclusive secrets, the original etcd native API has no maintenance and management functions related to locks. There are only two interfaces: lock and unlock. Locking requires holding the session object, and unlocking requires holding the lock object. The call is simple, but maintenance is troublesome. Here is the client integrating etcd4go produced by boot4go, The functions of distributed lock state query and management and maintenance are realized. Small partners who use database management tools must be familiar with the management of database locks. Here is the same way to maintain and manage.
#### You can view the lock holding process, lock time, and other application requests of the same lock object
![image](https://img-blog.csdnimg.cn/2ebe18d240a04300a3c34c22bae0cb9d.png)

#### It can be unlocked forcibly, and the next lock application will become the holder of the lock.
![image](https://img-blog.csdnimg.cn/facaba3079c04047976ee2f91e452600.png)

### User and Authorization management
![image](https://images.gitee.com/uploads/images/2022/0530/102037_81785dce_6575697.png)

![image](https://images.gitee.com/uploads/images/2022/0530/103309_0d3e2888_6575697.png)

### Role management
![image](https://images.gitee.com/uploads/images/2022/0530/102445_d443126c_6575697.png)

### Watch key changed and deleted
![image](https://images.gitee.com/uploads/images/2022/0530/103621_3226260b_6575697.png)

![image](https://images.gitee.com/uploads/images/2022/0530/104110_5a2d86ed_6575697.png)

### Cluster maintenance
![image](https://images.gitee.com/uploads/images/2022/0530/104310_dd026822_6575697.png)
![image](https://images.gitee.com/uploads/images/2022/0530/104343_11e0da56_6575697.png)
![image](https://images.gitee.com/uploads/images/2022/0530/104416_d1c69151_6575697.png)


### Others
![image](https://images.gitee.com/uploads/images/2022/0524/104248_dc1731a9_6575697.png)

## Installation and Getting Started

### From Github
- Download sourcecode from github website, visit https://github.com/boot4go.
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
  - docker image pull joinsunsoft/etcdv3-browser:0.9.0
- start container with image, and publish 80/443 port to your port
  - docker container run --rm -p 9980:80 --name etcdv3-browser joinsunsoft/etcdv3-browser:0.9.0

## Visit the browser tool
- You must add the host-mapping for the etcdv3-browser to be '****.joinsunsoft.com'
  - for example: 
    - My etcdv3-browser is install the machine which ip is 192.168.56.101
    - Add '192.168.56.101    etcdv3-broswer.joinsunsoft.com' to c:/windows/system32/drivers/etc/hosts file  
- Now, you can visit http://etcdv3-broswer.joinsunsoft.com:9980.
- Default Username/Password ginghan/123456
- Enjoy it now.