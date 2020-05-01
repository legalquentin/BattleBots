#! /bin/bash

cd infra && make prepare && make deploy:front && cp -r ../app/API/src/public/App ../app/api-node/src/public  && make run:battlebots
