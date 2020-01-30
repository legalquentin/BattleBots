
all:
	$(info Avalaible commands : run:postgres, serve:api, serve:front, deploy:api deploy:front)

prepare:
	cd ../app/api-node && yarn
	cd ../vuejs && yarn

run\:postgres:
	cd ../infra/.docker && docker-compose up -d
	make _back

logs\:postgres:
	cd ../infra/.docker && docker logs db && make _back

serve\:api:
	cd ../app/api-node && yarn run dev
	make _back

serve\:front:
	cd ../app/vuejs && yarn run serve
	make _back

deploy\:api:
	cd ../app/api-node && yarn run build
	make _back

deploy\:front:
	cd ../app/vuejs && yarn run build
	make _back

_back:
	cd ../../