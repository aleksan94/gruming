.PHONY: up down logs install build typecheck preview npm lint lint-fix format

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

typecheck:
	docker compose run --rm npm run typecheck

lint:
	docker compose run --rm npm run lint

lint-fix:
	docker compose run --rm npm run lint:fix

format:
	docker compose run --rm npm run format

# сначала build, затем сервер на http://localhost:4173
preview: build
	docker compose run --rm --service-ports preview

# произвольная команда: make npm ARGS="install axios"
npm:
	docker compose run --rm npm $(ARGS)
