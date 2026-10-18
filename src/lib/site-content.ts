import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import foto17 from "@/assets/luiz-brenda-17.jpg.asset.json";
import foto18 from "@/assets/luiz-brenda-18.jpg.asset.json";
import foto20 from "@/assets/luiz-brenda-20.jpg.asset.json";
import foto11 from "@/assets/luiz-brenda-11.jpg.asset.json";

import h1 from "@/assets/dresscode-h-1.jpg.asset.json";
import h2 from "@/assets/dresscode-h-2.jpg.asset.json";
import h3 from "@/assets/dresscode-h-3.jpg.asset.json";
import h4 from "@/assets/dresscode-h-4.jpg.asset.json";
import h5 from "@/assets/dresscode-h-5.jpg.asset.json";
import h6 from "@/assets/dresscode-h-6.jpg.asset.json";
import h7 from "@/assets/dresscode-h-7.jpg.asset.json";
import h8 from "@/assets/dresscode-h-8.jpg.asset.json";
import h9 from "@/assets/dresscode-h-9.jpg.asset.json";
import h10 from "@/assets/dresscode-h-10.jpg.asset.json";

import m1 from "@/assets/dresscode-m-1.jpg.asset.json";
import m2 from "@/assets/dresscode-m-2.jpg.asset.json";
import m3 from "@/assets/dresscode-m-3.jpg.asset.json";
import m4 from "@/assets/dresscode-m-4.jpg.asset.json";
import m5 from "@/assets/dresscode-m-5.jpg.asset.json";
import m6 from "@/assets/dresscode-m-6.jpg.asset.json";
import m7 from "@/assets/dresscode-m-7.jpg.asset.json";
import m8 from "@/assets/dresscode-m-8.jpg.asset.json";
import m9 from "@/assets/dresscode-m-9.jpg.asset.json";
import m10 from "@/assets/dresscode-m-10.jpg.asset.json";

export type TimelineItem = { time: string; label: string };

export type Ceremony = {
  eyebrow: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  mapsUrl: string;
  timeline: TimelineItem[];
};

export type Reception = {
  eyebrow: string;
  title: string;
  venue: string;
  address: string;
  timeLabel: string;
  endLabel: string;
  description: string;
  mapsUrl: string;
};

export type Dresscode = {
  eyebrow: string;
  title: string;
  intro: string;
  menTitle: string;
  womenTitle: string;
  men: string[];
  women: string[];
  avoidTitle: string;
  avoidNote: string;
};

export type GiftSection = {
  eyebrow: string;
  title: string;
  text: string;
  pixLabel: string;
  pixKey: string;
};

export type PreWedding = {
  eyebrow: string;
  title: string;
  photos: string[];
};

export type Manual = { id: string; title: string; subtitle: string; image?: string; items: string[] };
export type Manuals = { eyebrow: string; title: string; list: Manual[] };

export type Guest = { name: string; invited?: boolean };
export type GuestTable = { id: number; guests: Guest[] };
export type Tables = { eyebrow: string; title: string; list: GuestTable[] };

/** Aceita o formato antigo (strings) e o novo ({ name, invited }) — tudo vira Guest. */
export function guestsOf(raw: unknown): Guest[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((g) => {
      if (typeof g === "string") return { name: g.trim(), invited: false };
      const name = typeof (g as { name?: unknown })?.name === "string" ? (g as { name: string }).name.trim() : "";
      return { name, invited: !!(g as { invited?: unknown })?.invited };
    })
    .filter((g) => g.name !== "");
}

export function normalizeTables(value: Tables): Tables {
  return { ...value, list: value.list.map((t) => ({ id: t.id, guests: guestsOf(t.guests) })) };
}

export type SiteContent = {
  ceremony: Ceremony;
  reception: Reception;
  dresscode: Dresscode;
  manuals: Manuals;
  gift: GiftSection;
  prewedding: PreWedding;
  tables: Tables;
};

export const DEFAULT_CONTENT: SiteContent = {
  ceremony: {
    eyebrow: "Save the date",
    title: "A Cerimônia",
    dateLabel: "Sábado, 12 de dezembro de 2026",
    timeLabel: "Cerimônia às 17h30",
    venue: "Igreja Quadrangular Nova Vida",
    address: "Travessa Alferes Costa, 395 — Bairro Sacramenta",
    mapsUrl: "https://maps.app.goo.gl/dnu4C5zDWqUHMkBi7",
    timeline: [
      { time: "13:00", label: "Making Of" },
      { time: "15:00", label: "Chegada do Noivo" },
      { time: "16:40", label: "Chegada dos Convidados" },
      { time: "17:30", label: "Início da Cerimônia" },
      { time: "18:45", label: "Término da Cerimônia" },
      { time: "19:00", label: "Fotos com os Convidados" },
      { time: "19:45", label: "Encerramento" },
    ],
  },
  reception: {
    eyebrow: "Depois da cerimônia",
    title: "A Festa",
    venue: "Realiza Festas",
    address: "Tv. Timbó, 2634 — Marco",
    timeLabel: "A partir das 19h",
    endLabel: "Encerramento às 23h",
    description:
      "Depois do sim, seguimos todos para o salão: jantar, bebidas e muita comemoração juntos.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Realiza%20Festas%20Tv.%20Timb%C3%B3%202634%20Marco%20Bel%C3%A9m",
  },
  dresscode: {
    eyebrow: "Traje",
    title: "Dresscode",
    intro:
      "Queremos você confortável e elegante. Traje social, tons neutros e terrosos são bem-vindos. Navegue pelas sugestões com as setas.",
    menTitle: "Homens",
    womenTitle: "Mulheres",
    men: [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10].map((a) => a.url),
    women: [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10].map((a) => a.url),
    avoidTitle: "Por favor, evite",
    avoidNote: "Rosa e branco — para homens e mulheres.",
  },
  manuals: {
    eyebrow: "Combinados",
    title: "Manuais",
    list: [
      {
        id: "convidado",
        title: "Manual do Convidado",
        subtitle: "Orientações para todos que estarão conosco",
        image: foto17.url,
        items: [
          "Evite usar o celular durante a entrada do noivo, da noiva e dos familiares — este é o momento do fotógrafo. Você poderá fazer seus registros logo em seguida.",
          "Evite conversas paralelas durante a cerimônia. Cada palavra faz parte do nosso momento.",
          "Chegue com pelo menos 20 minutos de antecedência para acomodar todos com tranquilidade.",
          "Respeite o dresscode: sem tons de rosa e sem branco.",
          "Ao final da cerimônia, os convidados poderão enviar as fotos do casamento no nosso grupo do WhatsApp, que será criado para avisos prévios até o dia do casamento. Assim que a cerimônia terminar, o grupo será liberado para todos compartilharem os registros.",
        ],
      },
      {
        id: "familia",
        title: "Manual da Família",
        subtitle: "Para pais, irmãos e familiares próximos",
        image: foto18.url,
        items: [
          "Cheguem com 40 minutos de antecedência para as fotos de família antes da cerimônia.",
          "Os lugares das primeiras fileiras estarão reservados para os familiares.",
          "A entrada dos familiares acontece antes da entrada do noivo — fiquem atentos ao chamado da cerimonialista.",
          "Evitem registros com celular durante as entradas; a equipe de fotografia enviará todas as imagens depois.",
        ],
      },
      {
        id: "padrinhos",
        title: "Manual do Padrinho e Madrinha",
        subtitle: "Para quem caminha ao nosso lado",
        image: foto20.url,
        items: [
          "Chegada às 16h00 para organização das entradas e fotos prévias.",
          "As entradas serão em duplas, na ordem combinada com a cerimonialista.",
          "Traje: alinhado ao dresscode combinado previamente com os noivos.",
          "Permaneçam em pé ao lado do altar durante a cerimônia, conforme a marcação do ensaio.",
          "Após a cerimônia, permaneçam alguns minutos para as fotos oficiais com os noivos.",
        ],
      },
    ],
  },
  gift: {
    eyebrow: "Com carinho",
    title: "Nosso Presente",
    text:
      "Sua presença já é o maior presente — contribuir com o Pix não é obrigatório. Se quiser fazer parte do início da nossa história, deixamos abaixo nossa chave. Qualquer valor será recebido com muito amor.",
    pixLabel: "Chave Pix (e-mail)",
    pixKey: "brendaeluiz2026@gmail.com",
  },
  prewedding: {
    eyebrow: "Nossos registros",
    title: "Pré-Wedding",
    photos: [foto17.url, foto18.url, foto20.url, foto11.url],
  },
  tables: {
    eyebrow: "Recepção",
    title: "Mesa dos Convidados",
    list: [
      {
        id: 1,
        guests: [
          { name: "Manoel Gomes (Pai do Noivo)", invited: false },
          { name: "Maria do Socorro (Mãe do Noivo)", invited: false },
          { name: "João Souza", invited: false },
          { name: "Mirian Souza (Mãe da Noiva)", invited: false },
          { name: "Suzete Lopes (Avó da Noiva)", invited: false },
          { name: "Rayla Cristina", invited: false },
          { name: "Alberto Melo (Pai da Noiva)", invited: false },
          { name: "Gabrielly Cristina", invited: false },
        ],
      },
      {
        id: 2,
        guests: [
          { name: "Thaline Costa (Madrinha)", invited: false },
          { name: "Henrique", invited: false },
          { name: "Cássia Costa", invited: false },
          { name: "Antony Gabriel", invited: false },
          { name: "Marluce Silva", invited: false },
          { name: "Paloma Silva", invited: false },
          { name: "Sandro Gaia", invited: false },
          { name: "Cybelle Botelho", invited: false },
        ],
      },
      {
        id: 3,
        guests: [
          { name: "Brubs", invited: false },
          { name: "Maria Rita", invited: false },
          { name: "Verônica Souza", invited: false },
          { name: "Ana Reis (Avó da Noiva)", invited: false },
          { name: "Milena Reis", invited: false },
          { name: "Andrei Souza", invited: false },
          { name: "Naza Melo", invited: false },
          { name: "Erica", invited: false },
          { name: "Pedro", invited: false },
        ],
      },
      {
        id: 4,
        guests: [
          { name: "Renan Carvalho (Padrinho)", invited: false },
          { name: "Lirian Barros", invited: false },
          { name: "Sumano", invited: false },
          { name: "Mocotó", invited: false },
          { name: "Alan Rendrix", invited: false },
          { name: "Laura Couto", invited: false },
          { name: "Luiz Horizonte (Noivo)", invited: false },
          { name: "Brenda Melo (Noiva)", invited: false },
        ],
      },
      {
        id: 5,
        guests: [
          { name: "Jonatha David", invited: false },
          { name: "Dayane Lobo", invited: false },
          { name: "Isaac Lobo", invited: false },
          { name: "Carol Barros", invited: false },
          { name: "Ronildo", invited: false },
          { name: "Joelma", invited: false },
          { name: "Carina Leray", invited: false },
        ],
      },
    ],
  },
};

export const HERO_IMAGE = capa.url;

function merge<T>(fallback: T, value: unknown): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    const f = (fallback as Record<string, unknown>)[k];
    out[k] = f && typeof f === "object" && !Array.isArray(f) ? merge(f, v) : v;
  }
  return out as T;
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async (): Promise<SiteContent> => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      const map = new Map((data ?? []).map((r) => [r.key, r.value]));
      return {
        ceremony: merge(DEFAULT_CONTENT.ceremony, map.get("ceremony")),
        reception: merge(DEFAULT_CONTENT.reception, map.get("reception")),
        dresscode: merge(DEFAULT_CONTENT.dresscode, map.get("dresscode")),
        manuals: merge(DEFAULT_CONTENT.manuals, map.get("manuals")),
        gift: merge(DEFAULT_CONTENT.gift, map.get("gift")),
        prewedding: merge(DEFAULT_CONTENT.prewedding, map.get("prewedding")),
        tables: normalizeTables(merge(DEFAULT_CONTENT.tables, map.get("tables"))),
      };
    },
  });
}

export function useSaveSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: keyof SiteContent; value: unknown }) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: value as never }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-content"] }),
  });
}
