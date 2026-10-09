.PHONY: up down logs install build preview npm

up:
	docker compose up -d app

down:
	docker compose down

logs:
	docker compose logs -f app

install:
	docker compose run --rm npm install

build:
	docker compose run --rm npm run build

# сначала build, затем сервер на http://localhost:4173
preview: build
	docker compose run --rm --service-ports preview

# произвольная команда: make npm ARGS="install axios"
npm:
	docker compose run --rm npm $(ARGS)
