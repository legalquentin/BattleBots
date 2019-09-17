# Bot

Go api running on a raspeberry pi, it allow worker to intract with the robot GPIO
one instance should be running constantly on the machine in order to be available for
new game instances

## What it does

host an http api with a socket implementation to recceive Worker input, it convert them into gpio 
operations

### Disclaimer

This version is not currently usable on the raspi, code has been commented to debug on a physical
computer.
