
all:
	$(info Avalaible commands : run:postgres, serve:api, serve:front, deploy:api deploy:front, serve\:bot-stub)

prepare:
	cd ../app/api-node && npm i
	# cd ../app/vuejs && yarn

run\:battlebots:
	cd .docker && /usr/local/bin/docker-compose up --build -d && cd ../../app/api-node/ && npm run typeorm:migration:run:production && npm start

test\:battlebots:
	cd ../app/api-node && npm test

logs\:postgres:
	cd .docker && docker logs db && make _back

migrate\:api:
	cd ../app/api-node && npm run-script typeorm:migration:run:production

serve\:api:
	cd ../app/api-node && yarn run dev

serve\:api-bot:
	cd ../app/api-go && go run main.go 12345678910

serve\:stub-bot:
	cd ../app/api-bot/go/ && go run main.go

serve\:front:
	cd ../app/vuejs && yarn run serve

deploy\:api:
	cd ../app/api-node && yarn run build

deploy\:front:
	cd ../app/vuejs && yarn run build

all\:stop:
	cd .docker && docker-compose stop
