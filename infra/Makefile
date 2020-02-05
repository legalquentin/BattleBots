
all:
	$(info Avalaible commands : run:postgres, serve:api, serve:front, deploy:api deploy:front)

prepare:
	cd ../app/api-node && yarn
	cd ../app/vuejs && yarn

run\:postgres:
	cd .docker && docker-compose up -d

logs\:postgres:
	cd .docker && docker logs db && make _back

serve\:api:
	cd ../app/api-node && yarn run dev

serve\:front:
	cd ../app/vuejs && yarn run serve

deploy\:api:
	cd ../app/api-node && yarn run build

deploy\:front:
	cd ../app/vuejs && yarn run build