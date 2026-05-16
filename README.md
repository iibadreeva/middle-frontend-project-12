# Hexlet Chat

[![Actions Status](https://github.com/iibadreeva/middle-frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/iibadreeva/middle-frontend-project-12/actions)

Учебный frontend-проект чата в стиле Slack / Hexlet Chat.
Приложение написано на `React` и `Vite`, использует `JWT`-авторизацию, `Redux Toolkit` для состояния, `Axios` для HTTP-запросов и `Socket.IO` для получения новых сообщений в realtime.

## Демо

- [Деплой проекта](https://middle-frontend-project-12.onrender.com)
- [Референс интерфейса](https://frontend-chat-ru.hexlet.app)

Тестовый пользователь:

- `username: admin`
- `password: admin`

## Возможности

Сейчас в проекте реализовано:

- вход по логину и паролю;
- logout из верхнего navbar;
- сохранение сессии в `localStorage`;
- защита маршрута `/` для неавторизованных пользователей;
- загрузка каналов и сообщений после авторизации;
- выбор активного канала;
- отправка сообщений в чат;
- получение новых сообщений через `Socket.IO`;
- базовая обработка состояний загрузки, ошибок запроса и проблем с соединением.

## Локальный запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить backend

Проект использует пакет [`@hexlet/chat-server`](https://www.npmjs.com/package/@hexlet/chat-server), который уже добавлен в зависимости.

```bash
npx start-server
```

По умолчанию backend будет доступен на `http://localhost:5001`.

### 3. Запустить frontend

```bash
npm run dev
```

Frontend будет доступен на `http://localhost:5002`.

В dev-режиме `Vite` проксирует:

- `/api` -> `http://localhost:5001`
- `/socket.io` -> `ws://localhost:5001`

## Скрипты

- `npm run dev` — запуск frontend в режиме разработки
- `npm run build` — production build
- `npm run preview` — локальный просмотр production build
- `npm run start` — запуск собранной версии из `dist`
- `npm run lint` — проверка ESLint
- `npm run format` — форматирование Prettier
- `npm run format:check` — проверка форматирования

## Стек

- React
- Vite
- Redux Toolkit
- React Redux
- React Router
- Axios
- Socket.IO Client
- Formik
- Yup
- Bootstrap
- React Bootstrap

## Как устроено приложение

- авторизация выполняется через `POST /api/v1/login`;
- сервер возвращает `token` и `username`;
- токен сохраняется в `localStorage` и используется в заголовке `Authorization: Bearer <token>`;
- после входа приложение запрашивает каналы и сообщения;
- новые сообщения приходят через websocket-событие `newMessage`.

## Ограничения

На текущем этапе в проекте еще не реализованы полностью:

- регистрация пользователя;
- создание, переименование и удаление каналов;
- полное покрытие всех сценариев интерфейса, доступных в референсном приложении.

README отражает текущее состояние проекта, а не финальную целевую версию.

## Полезные ссылки

- [Документация сервера `@hexlet/chat-server`](https://www.npmjs.com/package/@hexlet/chat-server)
- [Render](https://render.com/)

