# Тёплая лапка — сайт груминг-салона

Vue 3 + Vite. Исходный дизайн-макет (React-рантайм) сохранён в `Main.dc.html` как справочник.

## Запуск

### Локально (Node.js)

    cp .env.example .env   # порт задаётся в .env
    npm install
    npm run dev      # разработка, http://localhost:$PORT (по умолчанию 5173)
    npm run build    # сборка в dist/

### Через Docker

Нужен Docker с плагином Compose. Два сервиса:

- `app` — dev-сервер Vite на http://localhost:${PORT} (по умолчанию 5173), работает постоянно, без прокси;
- `npm` — разовые команды (установка зависимостей, сборка), запускается вручную.

Оба используют общий том `node_modules`, поэтому зависимости нужно поставить до первого старта:

    docker compose run --rm npm install     # первый раз и после изменения package.json
    docker compose up -d                    # dev-сервер
    docker compose logs -f app              # логи
    docker compose down                     # остановка

Сборка и добавление пакетов:

    docker compose run --rm npm run build   # результат в dist/
    docker compose run --rm npm install axios

Если зависимости сломались (например, `ENOTEMPTY` или `SIGBUS` при старте), пересоздайте том:

    docker compose down -v
    docker compose run --rm npm install
    docker compose up -d

### Прокси для установки и сборки

Если интернет доступен только через прокси, он нужен лишь сервису `npm`. Скопируйте шаблон и
поправьте адрес и порт под себя:

    cp docker-compose.override.example.yml docker-compose.override.yml

Файл `docker-compose.override.yml` подхватывается автоматически и добавлен в `.gitignore`, поэтому
в репозиторий не попадает. В шаблоне включён `network_mode: host`: он нужен, если прокси слушает
только `127.0.0.1` на хосте. Если прокси доступен по обычному адресу, host-сеть можно убрать.
Без прокси ничего делать не нужно.

## Структура

Данные мастеров, услуг и записи живут в Google Sheets: см. [google-sheets/README.md](google-sheets/README.md)
(без `VITE_API_URL` показываются демо-данные из `src/data/demo.ts`).

`src/components/` — секции страницы, `src/data/salon.ts` — камеры, контакты, типы,
`src/style.css` — дизайн-токены (цвета, шрифты) и общие классы. Акцентный цвет — `--accent`.
