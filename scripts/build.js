const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");

// Читает файл из корня проекта.
function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

// Записывает файл в корень проекта.
function writeProjectFile(relativePath, content) {
  fs.writeFileSync(path.join(rootDir, relativePath), content, "utf8");
}

// Минимальное экранирование HTML для текста из JSON.
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Простая подстановка {{PLACEHOLDER}} внутри HTML-шаблонов.
function render(template, values) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      throw new Error(`Не найдено значение для плейсхолдера ${match}`);
    }
    return values[key];
  });
}

function renderProductCards(products) {
  const template = readProjectFile("templates/product-card.html");

  return products.map((product) => {
    const tags = product.tags
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");

    return render(template, {
      URL: escapeHtml(product.url),
      NAME: escapeHtml(product.name),
      IMAGE: escapeHtml(product.image),
      FALLBACK: escapeHtml(product.fallback),
      TYPE: escapeHtml(product.type),
      DESCRIPTION: escapeHtml(product.description),
      TAGS: tags
    });
  }).join("\n\n");
}

function renderCtaLinks(products) {
  return products.map((product, index) => {
    const className = index === 0 ? "btn btn-primary" : "btn btn-secondary";
    return `        <a class="${className}" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer">${escapeHtml(product.shortName)}</a>`;
  }).join("\n");
}

function renderProductSchema(products) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mamba CG featured Blender addons",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": product.name,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Blender",
        "url": product.url,
        "description": product.schemaDescription || product.description
      }
    }))
  };

  return JSON.stringify(schema, null, 2);
}

function renderSeoHead(seo, productSchema) {
  return render(readProjectFile("templates/seo-head.html"), {
    TITLE: escapeHtml(seo.title),
    DESCRIPTION: escapeHtml(seo.description),
    OG_TITLE: escapeHtml(seo.ogTitle),
    OG_DESCRIPTION: escapeHtml(seo.ogDescription),
    CANONICAL_URL: escapeHtml(seo.canonicalUrl),
    PRODUCT_SCHEMA: productSchema
  }).split("\n").map((line) => `  ${line}`).join("\n");
}

function renderPage({ outputPath, seo, mainContent, productSchema }) {
  const html = render(readProjectFile("templates/base-page.html"), {
    SEO_HEAD: renderSeoHead(seo, productSchema),
    HEADER: readProjectFile("templates/header.html").split("\n").map((line) => `  ${line}`).join("\n"),
    MAIN_CONTENT: mainContent.split("\n").map((line) => `  ${line}`).join("\n"),
    FOOTER: readProjectFile("templates/footer.html").split("\n").map((line) => `  ${line}`).join("\n")
  });

  writeProjectFile(outputPath, `${html.trim()}\n`);
  console.log(`Сборка завершена: ${outputPath} обновлен.`);
}

function build() {
  const products = JSON.parse(readProjectFile("data/products.json"));
  const productSchema = renderProductSchema(products);

  const productCards = renderProductCards(products)
    .split("\n")
    .map((line) => `        ${line}`)
    .join("\n");

  const indexContent = render(readProjectFile("templates/main-content.html"), {
    PRODUCT_CARDS: productCards,
    CTA_LINKS: renderCtaLinks(products)
  });

  renderPage({
    outputPath: "index.html",
    productSchema,
    seo: {
      title: "Mamba CG Blender Addons - Quick Water, HDRI Sky Pro, Quick Sky Pro",
      description: "Minimal Blender addons by Mamba CG for water, HDRI lighting and animated skies. Explore Quick Water - Ocean FX, HDRI Sky Pro and Quick Sky Pro on Superhive.",
      ogTitle: "Mamba CG Blender Addons",
      ogDescription: "Focused Blender addons for water, HDRI lighting and animated skies: Quick Water - Ocean FX, HDRI Sky Pro and Quick Sky Pro.",
      canonicalUrl: "https://mamba-cg.github.io/"
    },
    mainContent: indexContent
  });

  renderPage({
    outputPath: "about-me.html",
    productSchema,
    seo: {
      title: "About Me - Mamba CG",
      description: "About Mamba CG, a Blender creator making 3D visual assets, custom addons and workflow tools for artists.",
      ogTitle: "About Me - Mamba CG",
      ogDescription: "Learn about Mamba CG, a Blender creator focused on 3D graphics, custom addons, models and workflow tools.",
      canonicalUrl: "https://mamba-cg.github.io/about-me.html"
    },
    mainContent: readProjectFile("templates/about-me-content.html")
  });
}

build();
