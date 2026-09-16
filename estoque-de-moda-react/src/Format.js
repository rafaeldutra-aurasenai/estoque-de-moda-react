// Helpers de formatação usados pelo Dashboard, Relatórios e Notificações.
// Arquivo novo — crie em src/format.js

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

// R$ 1.234,50
export function brl(valor) {
  return moeda.format(Number(valor) || 0);
}

// R$ 96,4k  — para os cards de destaque, que ficam feios com o valor cheio
export function brlCurto(valor) {
  const n = Number(valor) || 0;
  if (n >= 1000) {
    return `R$ ${(n / 1000).toFixed(1).replace(".", ",")}k`;
  }
  return brl(n);
}

// "há 2h", "ontem", "há 3 dias"
export function tempoRelativo(dataIso) {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  const minutos = Math.floor((Date.now() - data.getTime()) / 60000);

  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ontem";
  if (dias < 30) return `há ${dias} dias`;

  return data.toLocaleDateString("pt-BR");
}

// true se a data cair no mês/ano corrente
export function esteMes(dataIso) {
  if (!dataIso) return false;
  const d = new Date(dataIso);
  const hoje = new Date();
  return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
}