# Worker

Go api with limited lifespan, one instance should be created for each game instance

## What it does

Once a game start, the node api will run this program in a container, it will handle users connections from internet and transfer data:  (video, controls, game attributes, events...)

- package "video" handle the video stream
- package "control" handle user input
- package "..." handle game instance, events, etc...

## Run it

> ```go run main.go```