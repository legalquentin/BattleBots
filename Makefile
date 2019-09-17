
all:
	$(info Avalaible commands : run:postgres, serve:api, serve:front, deploy:api deploy:front)

prepare:
	cd API && yarn
	cd GameIHM && yarn

run\:postgres:
	cd .docker && docker-compose up -d
	make _back
logs\:postgres:
	cd .docker && docker logs db && make _back

serve\:api:
	cd API && yarn run dev
	make _back

serve\:front:
	cd GameIHM && yarn run serve
	make _back

deploy\:api:
	cd API && yarn run build
	make _back

deploy\:front:
	cd GameIHM && yarn run build
	make _back

_back:
	cd ..