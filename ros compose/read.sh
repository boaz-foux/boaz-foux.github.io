ifconfig -> get en0 as LOCAL_IP 
xhost + LOCAL_IP 
docker run  -it --rm -e DISPLAY=LOCAL_IP:0 --net host -v /tmp/.X11-unix:/tmp/.X11-unix ros:kinetic bash
# if linux
docker run -it --rm -e DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix ros:kinetic bash


(. ros_entrypoint.sh) && \
apt-get update && \
apt-get install ros-kinetic-turtlesim -y && \
(roscore & (rosrun turtlesim turtlesim_node)  & echo 1) && \
rosrun turtlesim teleop_key