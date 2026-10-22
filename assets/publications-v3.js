const peerReviewed = [
  {
    year: 2026,
    authors: ["Hyunmin Jang", "Jin Hyeok Lee", "Gi Rim Han", "Dong-Won Jeong", "Kwang Seob Jeong", "Tai Hyun Yoon", "Minhaeng Cho"],
    corresponding: ["Kwang Seob Jeong", "Tai Hyun Yoon", "Minhaeng Cho"],
    title: "Ultrafast Band-Edge Carrier Dynamics in the Weyl Semiconductor Tellurium Microcrystal",
    journal: "The Journal of Physical Chemistry Letters 17, 4345–4351",
    url: "https://doi.org/10.1021/acs.jpclett.5c03942"
  },
  {
    year: 2025,
    authors: ["Hyunmin Jang", "Gi Rim Han", "Tai Hyun Yoon", "Minhaeng Cho"],
    corresponding: ["Tai Hyun Yoon", "Minhaeng Cho"],
    title: "Mid-Infrared Asynchronous and Interferometric Transient Absorption: Coherent Averaging with Sustained Ergodicity for Observing Ultrafast Dynamics in Heterogeneous Samples",
    journal: "Review of Scientific Instruments 96, 063001",
    url: "https://doi.org/10.1063/5.0253581"
  },
  {
    year: 2025,
    authors: ["Gi Rim Han", "Mai Ngoc An", "Hyunmin Jang", "Noh Soo Han", "JunWoo Kim", "Kwang Seob Jeong", "Tai Hyun Yoon", "Minhaeng Cho"],
    corresponding: ["Tai Hyun Yoon", "Minhaeng Cho"],
    title: "In situ and real-time ultrafast spectroscopy of photoinduced reactions in perovskite nanomaterials",
    journal: "Nature Communications 16, 4956",
    url: "https://doi.org/10.1038/s41467-025-60313-3"
  },
  {
    year: 2025,
    authors: ["Gi Rim Han", "Hyunmin Jang", "Tai Hyun Yoon", "Minhaeng Cho"],
    corresponding: ["Tai Hyun Yoon", "Minhaeng Cho"],
    title: "Asynchronous and Interferometric Nonlinear Spectroscopy (AI-NS): Expanding Temporal and Spectral Horizons",
    journal: "The Journal of Physical Chemistry B 129, 1891–1903",
    url: "https://doi.org/10.1021/acs.jpcb.4c08228"
  },
  {
    year: 2024,
    authors: ["Gi Rim Han", "Ohyun Kwon", "Sungmin Kim", "Jongwon Choi", "Jung Bae Son", "Kyung Suk Min", "Jong Woo Lee", "Byoungki Choi", "Seong Keun Kim"],
    coFirst: ["Gi Rim Han", "Ohyun Kwon", "Sungmin Kim"],
    corresponding: ["Ohyun Kwon", "Byoungki Choi", "Seong Keun Kim"],
    title: "Investigation of the Relationship between Quantum Yield, Charge-Transfer State, and Structure of the Ligands in Red-Emitting Heteroleptic Iridium(III) Complexes",
    journal: "The Journal of Physical Chemistry A 128, 6124–6131",
    url: "https://doi.org/10.1021/acs.jpca.4c00914"
  },
  {
    year: 2023,
    authors: ["Gi Rim Han", "Eunhak Lim", "Jooyeon Kang", "Doyk Hwang", "Jiyoung Heo", "Seong Keun Kim", "Jong Woo Lee"],
    coFirst: ["Gi Rim Han", "Eunhak Lim"],
    corresponding: ["Jong Woo Lee"],
    title: "Alcoholic Solvent-Mediated Excited-State Proton Transfer Dynamics of a Novel Dihydroxynaphthalene Dye",
    journal: "The Journal of Physical Chemistry A 127, 7884–7891",
    url: "https://doi.org/10.1021/acs.jpca.3c03170"
  },
  {
    year: 2023,
    authors: ["Hongki Kim", "Gi Rim Han", "Seong Keun Kim", "Taecheon Lyu", "Wonbin Choi", "Jong Woo Lee", "Joon Hak Oh"],
    corresponding: ["Jong Woo Lee", "Joon Hak Oh"],
    title: "Harnessing Strong Band-Filling in Mixed Pb–Sn Perovskites Boosts the Performance of Concentrator-Type Photovoltaics",
    journal: "ACS Energy Letters 8, 1122–1130",
    url: "https://doi.org/10.1021/acsenergylett.2c02791"
  },
  {
    year: 2022,
    authors: ["Hongki Kim", "Jong Woo Lee", "Gi Rim Han", "Yu Jin Kim", "Su Hwan Kim", "Seong Keun Kim", "Sang Kyu Kwak", "Joon Hak Oh"],
    corresponding: ["Sang Kyu Kwak", "Joon Hak Oh"],
    title: "Highly Efficient Hole Transport Layer-Free Low Bandgap Mixed Pb–Sn Perovskite Solar Cells Enabled by a Binary Additive System",
    journal: "Advanced Functional Materials 32, 2110069",
    url: "https://doi.org/10.1002/adfm.202110069"
  },
  {
    year: 2021,
    authors: ["Jun Xi", "Junseop Byeon", "Unsoo Kim", "Kijoon Bang", "Gi Rim Han", "Ji-Young Kim", "Jungjin Yoon", "Hua Dong", "Zhaoxin Wu", "Giorgio Divitini", "Kai Xi", "Jinwoo Park", "Tae-Woo Lee", "Seong Keun Kim", "Mansoo Choi", "Jong Woo Lee"],
    coFirst: ["Jun Xi", "Junseop Byeon", "Unsoo Kim", "Kijoon Bang"],
    corresponding: ["Jun Xi", "Jong Woo Lee"],
    title: "Abnormal Spatial Heterogeneity Governing Charge-Carrier Mechanism in Efficient Ruddlesden–Popper Perovskite Solar Cells",
    journal: "Energy & Environmental Science 14, 4915–4925",
    url: "https://doi.org/10.1039/D1EE00984B"
  },
  {
    year: 2020,
    authors: ["Hongki Kim", "Jong Woo Lee", "Gi Rim Han", "Seong Keun Kim", "Joon Hak Oh"],
    corresponding: ["Joon Hak Oh"],
    title: "Synergistic Effects of Cation and Anion in an Ionic Imidazolium Tetrafluoroborate Additive for Improving the Efficiency and Stability of Half-Mixed Pb–Sn Perovskite Solar Cells",
    journal: "Advanced Functional Materials 30, 2008801",
    url: "https://doi.org/10.1002/adfm.202008801"
  },
  {
    year: 2019,
    authors: ["Tae Gyu Hwang", "Gi Rim Han", "Jae Moon Lee", "Jong Woo Lee", "Hong Mo Kim", "Doyk Hwang", "Seong Keun Kim", "Jae Pil Kim"],
    corresponding: ["Jae Pil Kim"],
    title: "Fluorescence Quenching of 4,4′-Dimethoxytriphenylamine-Substituted Diketopyrrolopyrrole via Intramolecular Photoinduced Electron Transfer",
    journal: "The Journal of Physical Chemistry C 123, 24263–24274",
    url: "https://doi.org/10.1021/acs.jpcc.9b07275"
  },
  {
    year: 2019,
    authors: ["Jong Woo Lee", "Haejun Yu", "Kisu Lee", "Sohyeon Bae", "Jungwon Kim", "Gi Rim Han", "Doyk Hwang", "Seong Keun Kim", "Jyongsik Jang"],
    coFirst: ["Jong Woo Lee", "Haejun Yu"],
    corresponding: ["Seong Keun Kim", "Jyongsik Jang"],
    title: "Highly Crystalline Perovskite-Based Photovoltaics via Two-Dimensional Liquid Cage Annealing Strategy",
    journal: "Journal of the American Chemical Society 141, 5808–5814",
    url: "https://doi.org/10.1021/jacs.8b13423"
  },
  {
    year: 2017,
    authors: ["Gi Rim Han", "Doyk Hwang", "Seunghoon Lee", "Jong Woo Lee", "Eunhak Lim", "Jiyoung Heo", "Seong Keun Kim"],
    coFirst: ["Gi Rim Han", "Doyk Hwang"],
    corresponding: ["Seong Keun Kim"],
    title: "Shedding New Light on an Old Molecule: Quinophthalone Displays Uncommon N-to-O Excited State Intramolecular Proton Transfer (ESIPT) Between Photobases",
    journal: "Scientific Reports 7, 3863",
    url: "https://doi.org/10.1038/s41598-017-04114-9"
  },
  {
    year: 2015,
    authors: ["Jiwoong Kwon", "Jihee Hwang", "Jaewan Park", "Gi Rim Han", "Kyu Young Han", "Seong Keun Kim"],
    coFirst: ["Jiwoong Kwon", "Jihee Hwang"],
    corresponding: ["Kyu Young Han", "Seong Keun Kim"],
    title: "RESOLFT Nanoscopy with Photoswitchable Organic Fluorophores",
    journal: "Scientific Reports 5, 17804",
    url: "https://doi.org/10.1038/srep17804"
  }
];

const manuscripts = [
  {
    year: 2026,
    authors: ["Gi Rim Han", "Minhaeng Cho"],
    corresponding: ["Minhaeng Cho"],
    title: "Time-Resolved Asynchronous and Interferometric Nonlinear Spectroscopy (AI-NS)",
    venue: "Annual Review of Physical Chemistry",
    status: {
      en: "Accepted with minor revision; revision in progress (author-reported)",
      ko: "Minor revision 조건부 승인 후 수정 진행 중(본인 확인)"
    }
  },
  {
    year: 2026,
    authors: ["Ju-Young Kim", "Anirban Mondal", "Gi Rim Han", "Kwang Jin Lee", "Jong Min Lim", "Myeongsam Jen", "Minhaeng Cho"],
    coFirst: ["Ju-Young Kim", "Anirban Mondal"],
    corresponding: ["Minhaeng Cho"],
    title: "Vortex-Beam Transient Absorption Microspectroscopy Resolves Ultrafast Free-Exciton and Polaron Diffusion in 2D Perovskites",
    venue: "arXiv:2607.14678 · manuscript submitted",
    status: {
      en: "Preprint available",
      ko: "프리프린트 공개 및 투고 중"
    },
    url: "https://arxiv.org/abs/2607.14678"
  },
  {
    year: 2026,
    authors: ["Hyunmin Jang", "JunWoo Kim", "Dong-Won Jeong", "Gi Rim Han", "Dasol Kim", "Tai Hyun Yoon", "Minhaeng Cho"],
    coFirst: ["Hyunmin Jang", "JunWoo Kim"],
    corresponding: ["Tai Hyun Yoon", "Minhaeng Cho"],
    title: "Asynchronous Interferometric Nonlinear Spectroscopy of Ultrafast Carrier Dynamics in InAs",
    venue: "Physical Review Research · manuscript submitted",
    status: {
      en: "Under review",
      ko: "투고 심사 중"
    }
  }
];

function formattedAuthors({ authors: names, coFirst = [], corresponding = [] }) {
  const highlighted = names.map((name) => {
    const author = name === "Gi Rim Han" ? `<strong class="author-self">${name}</strong>` : name;
    const marks = [];
    const roles = [];
    if (coFirst.includes(name)) { marks.push("†"); roles.push("Co-first author"); }
    if (corresponding.includes(name)) { marks.push("*"); roles.push("Corresponding author"); }
    const marker = marks.length
      ? `<sup class="author-markers" title="${roles.join("; ")}"><span aria-hidden="true">${marks.join(",")}</span><span class="visually-hidden"> (${roles.join("; ")})</span></sup>`
      : "";
    return `${author}${marker}`;
  });
  if (highlighted.length === 1) return highlighted[0];
  if (highlighted.length === 2) return `${highlighted[0]} and ${highlighted[1]}`;
  return `${highlighted.slice(0, -1).join(", ")}, and ${highlighted.at(-1)}`;
}

function publicationMarkup(item, progress = false) {
  const title = item.url
    ? `<a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>`
    : item.title;
  return `
    <article class="publication-entry${progress ? " manuscript-entry" : ""}">
      <div>
        <p class="publication-authors">${formattedAuthors(item)}</p>
        <h3>${title}</h3>
        ${progress ? "" : `<p class="publication-journal">${item.journal}</p>`}
      </div>
    </article>
  `;
}

function publicationsByYear(items) {
  const groups = [];
  items.forEach((item) => {
    let group = groups[groups.length - 1];
    if (!group || group.year !== item.year) {
      group = { year: item.year, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });
  return `<table class="publication-table" aria-label="Publications by year">${groups.map((group) => `
    <tbody>${group.items.map((item, index) => `
      <tr>
        ${index === 0 ? `<th class="publication-year" scope="rowgroup" rowspan="${group.items.length}">${group.year}</th>` : ""}
        <td>${publicationMarkup(item)}</td>
      </tr>`).join("")}
    </tbody>`).join("")}</table>`;
}

function renderPublications() {
  const peerList = document.querySelector("#peer-reviewed-list");
  const progressList = document.querySelector("#progress-list");
  if (peerList) peerList.innerHTML = publicationsByYear(peerReviewed);
  if (progressList) progressList.innerHTML = manuscripts.map((item) => publicationMarkup(item, true)).join("");
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderPublications);
  document.addEventListener("languagechange", renderPublications);
}

if (typeof module !== "undefined") {
  module.exports = { peerReviewed, manuscripts, publicationsByYear, publicationMarkup };
}
