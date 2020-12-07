# Docker Simulation

install **x11**(x11) or **xqartz**(mac) and **docker**.


clean up the environment:
```shell
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker system prune -f
```

if running on mac, add supoort to the machine ip of the x11 functionality
```shell
xhost + {{LOCAL_IP}}
```


to start the simulation run
```shell
 DISPLAY={{LOCAL_IP}}:0  docker-compose build && docker-compose up
```



