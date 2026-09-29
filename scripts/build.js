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
      DETAIL_URL: escapeHtml(product.detailUrl || product.url),
      TARGET_ATTRS: product.url.startsWith("https://") ? 'target="_blank" rel="noopener noreferrer"' : '',
      CTA: escapeHtml(product.shortName || "Explore add-on"),
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
        "url": product.schemaUrl || product.url,
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
      title: "Blender Add-ons for Animation, Wildlife & Environments | Mamba CG",
      description: "Explore Blender add-ons for audio-reactive animation, bird flocks, garden plants and stylized water. See features, examples and product links from Mamba CG.",
      ogTitle: "Blender Add-ons for Animation, Wildlife & Environments | Mamba CG",
      ogDescription: "Explore Blender add-ons for audio-reactive animation, bird flocks, garden plants and stylized water.",
      canonicalUrl: "https://mamba-cg.github.io/"
    },
    mainContent: indexContent
  });

  renderPage({
    outputPath: "about-me.html",
    productSchema,
    seo: {
      title: "About Mamba CG | Blender Add-on Creator",
      description: "Meet Mamba CG, a Blender creator making add-ons for audio animation, procedural flocks, garden scenes and stylized water.",
      ogTitle: "About Mamba CG | Blender Add-on Creator",
      ogDescription: "Learn about the creator behind Mamba CG's Blender add-ons for animation and scene building.",
      canonicalUrl: "https://mamba-cg.github.io/about-me.html"
    },
    mainContent: readProjectFile("templates/about-me-content.html")
  });
}

build();
