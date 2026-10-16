
const EMOJIS_CATEGORIA = {
  "Vestidos": "👗",
  "Blusas": "👚",
  "Camisetas": "👕",
  "Regatas": "👚",
  "Croppeds": "👚",
  "Camisas": "👔",
  "Calças": "👖",
  "Calças jeans": "👖",
  "Calças de alfaiataria": "👖",
  "Shorts": "🩳",
  "Bermudas": "🩳",
  "Saias": "👗",
  "Macacões": "🩱",
  "Conjuntos": "👚",
  "Blazers": "🧥",
  "Casacos": "🧥",
  "Jaquetas": "🧥",
  "Cardigãs": "🧥",
  "Tricôs e malhas": "🧶",
  "Moletom": "🧥",
  "Moda social": "👔",
  "Moda esportiva": "🏃",
  "Moda praia": "🩱",
  "Pijamas": "🛌",
  "Roupas infantis": "👕",
  "Roupas masculinas": "👕",
  "Roupas femininas": "👚",
  "Outros": "👕"
};

export function emojiDaCategoria(categoria) {
  if (!categoria) return "👕";

  const nome = String(categoria).trim();

  if (EMOJIS_CATEGORIA[nome]) {
    return EMOJIS_CATEGORIA[nome];
  }

  const texto = nome.toLowerCase();

  if (texto.includes("vestido") || texto.includes("saia")) return "👗";
  if (texto.includes("calça")) return "👖";
  if (texto.includes("short") || texto.includes("bermuda")) return "🩳";
  if (texto.includes("jaqueta") || texto.includes("casaco") ||
      texto.includes("blazer") || texto.includes("moletom")) return "🧥";
  if (texto.includes("tricô") || texto.includes("malha")) return "🧶";
  if (texto.includes("camisa")) return "👔";
  if (texto.includes("praia") || texto.includes("maiô") ||
      texto.includes("biquíni")) return "🩱";
  if (texto.includes("pijama")) return "🛌";
  if (texto.includes("esport")) return "🏃";
  if (texto.includes("blusa") || texto.includes("regata") ||
      texto.includes("cropped")) return "👚";

  return "👕";
}
