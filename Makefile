.PHONY: up down logs install build typecheck preview npm lint lint-fix format

# Быстрые проверки идут в уже запущенном контейнере app,
# если он не поднят - в одноразовом контейнере npm
APP_RUNNING := $(shell docker compose ps -q --status running app 2>/dev/null)
NPM_CHECK = $(if $(APP_RUNNING),docker compose exec app npm,docker compose run --rm npm)

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
	$(NPM_CHECK) run typecheck

lint:
	$(NPM_CHECK) run lint

lint-fix:
	$(NPM_CHECK) run lint:fix

format:
	$(NPM_CHECK) run format

# сначала build, затем сервер на http://localhost:4173
preview: build
	docker compose run --rm --service-ports preview

# произвольная команда: make npm ARGS="install axios"
npm:
	docker compose run --rm npm $(ARGS)
