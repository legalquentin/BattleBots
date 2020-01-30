# api-bot


## go

Go api running on a raspeberry pi, it allow worker to intract with the robot GPIO
one instance should be running constantly on the machine in order to be available for
new game instances

host an http api with a socket implementation to recceive Worker input, it convert them into gpio 
operations

## python

Helper code to recover video stream form the camera with minimum latency and expose it to local 

### Disclaimer

This version is not currently usable on the raspi, code has been commented to debug on a physical
computer.
