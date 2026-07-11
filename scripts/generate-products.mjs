import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const ROOT = "/Users/Juamnoz/Desktop/proyectos/monaco parfums";
const csv = readFileSync(`${ROOT}/catalog.csv`, "utf-8").trim().split("\n");
const header = csv.shift(); // categoria,marca_origen,name,price_cop,has_image_in_sheet

const images = readdirSync(`${ROOT}/web/public/products`);

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(str) {
  return str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}

const products = csv.map((line, i) => {
  const idx = i + 1;
  const [categoria, marca_origen, name, price_cop] = line.split(",");
  const idxStr = String(idx).padStart(2, "0");
  const candidates = images.filter((f) => f.startsWith(`${idxStr}-`));
  // prefer the file without "-alt" in the name
  const file =
    candidates.find((f) => !f.includes("-alt")) || candidates[0];

  const cleanName = titleCase(name.trim());
  const category = categoria === "NICHO" ? "nicho" : "arabes";
  const isTester = /tester/i.test(name);

  return {
    id: idx,
    slug: `${idxStr}-${slugify(name)}`,
    name: cleanName,
    brand: marca_origen.trim(),
    category,
    categoryLabel: category === "nicho" ? "Nicho" : "Árabe",
    price: Number(price_cop),
    image: `/products/${file}`,
    isTester,
  };
});

const out = `// Auto-generado desde catalog.csv — no editar a mano, correr scripts/generate-products.mjs
export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: "arabes" | "nicho";
  categoryLabel: string;
  price: number;
  image: string;
  isTester: boolean;
};

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

writeFileSync(`${ROOT}/web/src/data/products.ts`, out);
console.log(`Generated ${products.length} products.`);
