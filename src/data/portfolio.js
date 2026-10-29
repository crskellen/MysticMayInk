import { artists } from "./artists.js";

// The catalog is data, not a fixed form. A new artist is an entry in
// artists.js. A new style, subject, placement, or size is an entry in
// the lists below, then a tag on a piece. Room and ink-cap shots stay
// out. A piece with no artistId has no recorded artist.
// `filmStyle` is the name under that photo on the home filmstrip.
// `added` follows the stand-in chronology. `opening` is the filmstrip
// order; 0 means the piece is not in that strip.

export const portfolioStyles = [
  "Botanical & Floral",
  "Fine Line",
  "Black & Grey",
  "Blackwork",
  "Fantasy & Anime",
  "Cover-Ups",
];

export const portfolioFacets = [
  {
    id: "color",
    label: "Color",
    options: [
      { id: "black-grey", label: "Black and grey" },
      { id: "color", label: "Color" },
      { id: "black", label: "Black" },
    ],
  },
  {
    id: "shading",
    label: "Shading",
    options: [
      { id: "shaded", label: "Shaded" },
      { id: "linework", label: "Linework" },
    ],
  },
  {
    id: "style",
    label: "Style",
    options: [
      {
        id: "botanical",
        label: "Botanical & floral",
        children: [
          { id: "floral", label: "Floral" },
          { id: "fern", label: "Fern" },
        ],
      },
      { id: "fine-line", label: "Fine line" },
      { id: "blackwork", label: "Blackwork" },
      {
        id: "fantasy",
        label: "Fantasy & anime",
        children: [
          { id: "fantasy-work", label: "Fantasy" },
          { id: "anime", label: "Anime" },
          { id: "bookish", label: "Bookish" },
        ],
      },
      { id: "cover-up", label: "Cover-ups" },
      { id: "realism", label: "Realism" },
      { id: "illustrative", label: "Illustrative" },
      { id: "traditional", label: "Traditional" },
      { id: "neo-traditional", label: "Neo-traditional" },
      { id: "japanese", label: "Japanese" },
      { id: "watercolor", label: "Watercolor" },
      { id: "geometric", label: "Geometric" },
      { id: "ornamental", label: "Ornamental" },
      { id: "script", label: "Script" },
      { id: "dotwork", label: "Dotwork" },
      { id: "surrealism", label: "Surrealism" },
      { id: "chicano", label: "Chicano" },
      { id: "new-school", label: "New school" },
      { id: "ignorant", label: "Ignorant" },
      { id: "tribal", label: "Tribal" },
      { id: "biomechanical", label: "Biomechanical" },
      { id: "trash-polka", label: "Trash polka" },
    ],
  },
  {
    id: "subject",
    label: "Subject",
    options: [
      { id: "animals", label: "Animals" },
      { id: "religion", label: "Religion" },
      { id: "mythology", label: "Mythology" },
      { id: "nature", label: "Nature" },
      { id: "insect", label: "Insect" },
      { id: "celestial", label: "Celestial" },
      { id: "portrait", label: "Portrait" },
      { id: "lettering", label: "Lettering" },
      { id: "skull", label: "Skull" },
      { id: "weapon", label: "Weapon" },
      { id: "figure", label: "Figure" },
    ],
  },
];

export const locations = [
  { id: "head", label: "Head" },
  { id: "face", label: "Face" },
  { id: "neck", label: "Neck" },
  { id: "chest", label: "Chest" },
  { id: "sternum", label: "Sternum" },
  { id: "ribs", label: "Ribs" },
  { id: "stomach", label: "Stomach" },
  { id: "back", label: "Back" },
  { id: "shoulder", label: "Shoulder" },
  { id: "collarbone", label: "Collarbone" },
  { id: "upper-arm", label: "Upper arm" },
  { id: "elbow", label: "Elbow" },
  { id: "forearm", label: "Forearm" },
  { id: "wrist", label: "Wrist" },
  { id: "hand", label: "Hand" },
  { id: "finger", label: "Finger" },
  { id: "hip", label: "Hip" },
  { id: "thigh", label: "Thigh" },
  { id: "knee", label: "Knee" },
  { id: "calf", label: "Calf" },
  { id: "shin", label: "Shin" },
  { id: "ankle", label: "Ankle" },
  { id: "foot", label: "Foot" },
];

export const sizes = [
  { id: "flash", label: "Flash" },
  { id: "piece", label: "Piece" },
  { id: "band", label: "Band" },
  { id: "panel", label: "Panel" },
  { id: "half-sleeve", label: "Half sleeve" },
  { id: "three-quarter-sleeve", label: "Three-quarter sleeve", also: "3/4 sleeve" },
  { id: "full-sleeve", label: "Full sleeve" },
  { id: "leg-sleeve", label: "Leg sleeve" },
  { id: "back-piece", label: "Back piece" },
  { id: "chest-piece", label: "Chest piece" },
];

export const portfolioSorts = [
  { id: "newest", label: "Recently added" },
  { id: "oldest", label: "Oldest" },
  { id: "artist", label: "Artist" },
  { id: "style", label: "Style" },
  { id: "name", label: "Name" },
];

export const portfolio = [
  {
    id: "peony",
    title: "Peony",
    artistId: "meagan",
    filmStyle: "Botanical & Floral",
    tags: ["black-grey", "shaded", "floral"],
    keywords: ["peony"],
    placement: "forearm",
    size: "piece",
    added: 1793127600,
    opening: 1,
    width: 720,
    height: 1280,
    alt: "Botanical and floral tattoo",
  },
  {
    id: "fox",
    title: "Fox",
    artistId: "",
    filmStyle: "Black & Grey",
    tags: ["black-grey", "shaded", "realism", "animals"],
    keywords: ["fox"],
    placement: "thigh",
    size: "piece",
    added: 1793134800,
    opening: 2,
    width: 832,
    height: 1248,
    alt: "Black and grey tattoo",
  },
  {
    id: "blackwork",
    title: "Blackwork panel",
    artistId: "britt",
    filmStyle: "Blackwork",
    tags: ["black", "blackwork"],
    keywords: ["panel"],
    placement: "",
    size: "panel",
    added: 1793203200,
    opening: 3,
    width: 720,
    height: 1280,
    alt: "Blackwork tattoo",
  },
  {
    id: "olive",
    title: "Olive branch",
    artistId: "britt",
    filmStyle: "Fine Line",
    tags: ["linework", "fine-line", "botanical"],
    keywords: ["olive"],
    placement: "",
    size: "piece",
    added: 1793196000,
    opening: 4,
    width: 720,
    height: 1280,
    alt: "Fine line tattoo",
  },
  {
    id: "fern",
    title: "Fern",
    artistId: "meagan",
    filmStyle: "Botanical & Floral",
    tags: ["black-grey", "shaded", "fern"],
    keywords: ["fern"],
    placement: "",
    size: "piece",
    added: 1793192400,
    opening: 5,
    width: 720,
    height: 1280,
    alt: "Botanical and floral tattoo",
  },
  {
    id: "dagger",
    title: "Dagger",
    artistId: "britt",
    filmStyle: "Fine Line",
    tags: ["linework", "fine-line", "weapon"],
    keywords: ["dagger"],
    placement: "",
    size: "piece",
    added: 1793219400,
    opening: 6,
    width: 832,
    height: 1248,
    alt: "Fine line tattoo",
  },
  {
    id: "coverup",
    title: "Floral cover-up",
    artistId: "meagan",
    filmStyle: "Cover-Ups",
    tags: ["floral", "cover-up"],
    keywords: ["cover-up"],
    placement: "",
    size: "piece",
    added: 1793204100,
    opening: 7,
    width: 720,
    height: 1280,
    alt: "Cover-up tattoo",
  },
  {
    id: "moth",
    title: "Moth and moon",
    artistId: "britt",
    filmStyle: "Fine Line",
    tags: ["linework", "fine-line", "insect", "celestial"],
    keywords: ["moth", "moon"],
    placement: "",
    size: "piece",
    added: 1793275200,
    opening: 8,
    width: 720,
    height: 1280,
    alt: "Fine line tattoo",
  },
  {
    id: "wildflower",
    title: "Wildflower",
    artistId: "meagan",
    filmStyle: "",
    tags: ["linework", "fine-line", "floral"],
    keywords: ["wildflower"],
    placement: "forearm",
    size: "piece",
    added: 1793210400,
    opening: 0,
    width: 832,
    height: 1248,
    alt: "Fine line wildflower tattoo",
  },
  {
    id: "rose",
    title: "Rose",
    artistId: "meagan",
    filmStyle: "",
    tags: ["black-grey", "shaded", "realism", "floral"],
    keywords: ["rose"],
    placement: "shoulder",
    size: "piece",
    added: 1793311200,
    opening: 0,
    width: 832,
    height: 1248,
    alt: "Black and grey rose tattoo",
  },
  {
    id: "band",
    title: "Blackwork band",
    artistId: "britt",
    filmStyle: "",
    tags: ["black", "blackwork"],
    keywords: ["band"],
    placement: "upper-arm",
    size: "band",
    added: 1793286000,
    opening: 0,
    width: 832,
    height: 1248,
    alt: "Blackwork band tattoo",
  },
];

const skippedTokens = new Set(["and", "or", "the", "a", "an", "of"]);

function flatten(options, group, parentId, into) {
  for (const option of options) {
    into.push({
      id: option.id,
      label: option.label,
      also: option.also ?? "",
      group,
      parentId,
    });
    if (option.children) flatten(option.children, group, option.id, into);
  }
}

const flatOptions = portfolioFacets.flatMap((facet) => {
  const into = [];
  flatten(facet.options, facet.id, "", into);
  return into;
});

const optionById = new Map(flatOptions.map((option) => [option.id, option]));
const locationById = new Map(locations.map((place) => [place.id, place]));
const sizeById = new Map(sizes.map((size) => [size.id, size]));

export function artistName(artistId) {
  if (!artistId) return "";
  return artists.find((artist) => artist.id === artistId)?.name ?? "";
}

export function locationLabel(id) {
  return locationById.get(id)?.label ?? "";
}

export function sizeLabel(id) {
  return sizeById.get(id)?.label ?? "";
}

function descendantIds(id) {
  return flatOptions
    .filter((option) => option.parentId === id)
    .flatMap((option) => [option.id, ...descendantIds(option.id)]);
}

function ancestorLabels(id) {
  const labels = [];
  let current = optionById.get(id);
  while (current) {
    labels.push(current.label);
    if (current.also) labels.push(current.also);
    current = current.parentId ? optionById.get(current.parentId) : null;
  }
  return labels;
}

export function pieceCaption(piece) {
  const labels = [];
  for (const tag of piece.tags) {
    const option = optionById.get(tag);
    if (!option) continue;
    if (option.group === "color" || option.group === "style") labels.push(option.label);
  }
  return labels.join(" · ");
}

export function openingPieces(pieces = portfolio) {
  return pieces
    .filter((piece) => piece.opening > 0)
    .sort((left, right) => left.opening - right.opening);
}

export function portfolioKeywords(pieces = portfolio) {
  return [...new Set(pieces.flatMap((piece) => piece.keywords))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function plain(value) {
  return String(value ?? "")
    .toLowerCase()
    .replaceAll("&", " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function queryTokens(query) {
  return plain(query)
    .split(" ")
    .filter((token) => token && !skippedTokens.has(token));
}

function haystack(piece) {
  const tagText = piece.tags.flatMap((tag) => ancestorLabels(tag));
  return plain(
    [
      piece.title,
      piece.filmStyle,
      artistName(piece.artistId),
      ...tagText,
      ...piece.keywords,
      locationLabel(piece.placement),
      sizeLabel(piece.size),
      piece.size === "three-quarter-sleeve" ? "3/4" : "",
    ].join(" "),
  );
}

function pieceMatchesTag(piece, tagId) {
  const accepted = new Set([tagId, ...descendantIds(tagId)]);
  return piece.tags.some((tag) => accepted.has(tag));
}

export function filterPieces(pieces, criteria = {}) {
  const artistIds = criteria.artistIds ?? [];
  const tags = criteria.tags ?? [];
  const placements = criteria.placements ?? [];
  const sizeIds = criteria.sizes ?? [];
  const tokens = queryTokens(criteria.query);
  const tagsByGroup = new Map();
  for (const tag of tags) {
    const group = optionById.get(tag)?.group ?? tag;
    const list = tagsByGroup.get(group) ?? [];
    list.push(tag);
    tagsByGroup.set(group, list);
  }
  return pieces.filter((piece) => {
    if (artistIds.length > 0 && !artistIds.includes(piece.artistId)) return false;
    for (const selected of tagsByGroup.values()) {
      if (!selected.some((tag) => pieceMatchesTag(piece, tag))) return false;
    }
    if (placements.length > 0 && !placements.includes(piece.placement)) return false;
    if (sizeIds.length > 0 && !sizeIds.includes(piece.size)) return false;
    if (tokens.length > 0) {
      const text = haystack(piece);
      if (!tokens.every((token) => text.includes(token))) return false;
    }
    return true;
  });
}

function byTitle(left, right) {
  return left.title.localeCompare(right.title);
}

function styleRank(piece) {
  let best = flatOptions.length;
  for (const tag of piece.tags) {
    const option = optionById.get(tag);
    if (option?.group !== "style") continue;
    const index = flatOptions.findIndex((item) => item.id === tag);
    if (index >= 0 && index < best) best = index;
  }
  return best;
}

export function sortPieces(pieces, sort) {
  const list = [...pieces];
  if (sort === "oldest") {
    list.sort((left, right) => left.added - right.added || byTitle(left, right));
  } else if (sort === "artist") {
    list.sort((left, right) => {
      const leftName = artistName(left.artistId);
      const rightName = artistName(right.artistId);
      if (!leftName && rightName) return 1;
      if (leftName && !rightName) return -1;
      return leftName.localeCompare(rightName) || byTitle(left, right);
    });
  } else if (sort === "style") {
    list.sort((left, right) => styleRank(left) - styleRank(right) || byTitle(left, right));
  } else if (sort === "name") {
    list.sort(byTitle);
  } else {
    list.sort((left, right) => right.added - left.added || byTitle(left, right));
  }
  return list;
}
