# Mamba CG Official Website

Статический сайт для GitHub Pages. Финальные HTML-файлы сайта - `index.html` и `about-me.html`, но теперь их лучше не редактировать вручную: они собираются из шаблонов командой Node.js.

## Что нужно установить

Нужен Node.js. Проверить установку:

```bash
node --version
npm --version
```

Если команды показывают версии, можно запускать сборщик.

## Основные команды

Собрать HTML-страницы из шаблонов:

```bash
npm run build
```

Запустить сборку и локальный сервер:

```bash
npm run dev
```

После `npm run dev` сайт будет доступен в браузере:

```text
http://127.0.0.1:8000/
```

Остановить локальный сервер можно сочетанием клавиш:

```text
Ctrl + C
```

## Как устроена сборка

Сборщик находится здесь:

```text
scripts/build.js
```

Он читает части сайта:

```text
templates/base-page.html
templates/seo-head.html
templates/header.html
templates/main-content.html
templates/about-me-content.html
templates/product-card.html
templates/footer.html
data/products.json
```

Потом подставляет данные в плейсхолдеры вида:

```html
{{HEADER}}
{{PRODUCT_CARDS}}
{{FOOTER}}
```

И записывает готовые страницы сюда:

```text
index.html
about-me.html
```

## Что где редактировать

Шапка сайта:

```text
templates/header.html
```

Футер:

```text
templates/footer.html
```

Основные секции страницы:

```text
templates/main-content.html
```

Страница About Me:

```text
templates/about-me-content.html
```

SEO, favicon, Open Graph и JSON-LD:

```text
templates/seo-head.html
```

Карточка одного продукта:

```text
templates/product-card.html
```

Список продуктов, ссылки, картинки, описания и теги:

```text
data/products.json
```

Стили сайта:

```text
css/styles.css
```

## Как добавить новый продукт

1. Откройте `data/products.json`.
2. Скопируйте один объект продукта.
3. Измените `name`, `url`, `image`, `fallback`, `description`, `tags`.
4. Запустите:

```bash
npm run build
```

После этого новый продукт появится в `index.html`.

## Важное правило

Редактируйте шаблоны и `data/products.json`, а не собранные `index.html` и `about-me.html`. Если изменить HTML-файлы вручную, следующая команда `npm run build` перезапишет эти изменения.
