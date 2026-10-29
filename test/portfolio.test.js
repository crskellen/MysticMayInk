import assert from "node:assert/strict";
import test from "node:test";
import { artists } from "../src/data/artists.js";
import {
  artistName,
  filterPieces,
  locations,
  openingPieces,
  portfolio,
  portfolioFacets,
  portfolioKeywords,
  sizes,
  sortPieces,
} from "../src/data/portfolio.js";

test("the home filmstrip stays the approved eight, in order", () => {
  const opening = openingPieces();
  assert.deepEqual(
    opening.map((piece) => piece.id),
    ["peony", "fox", "blackwork", "olive", "fern", "dagger", "coverup", "moth"],
  );
  assert.deepEqual(
    opening.map((piece) => piece.filmStyle),
    [
      "Botanical & Floral",
      "Black & Grey",
      "Blackwork",
      "Fine Line",
      "Botanical & Floral",
      "Fine Line",
      "Cover-Ups",
      "Fine Line",
    ],
  );
  assert.equal(opening.every((piece) => !piece.alt.includes("Meagan")), true);
  assert.equal(opening.every((piece) => !piece.alt.includes("Brittany")), true);
  assert.equal(opening.every((piece) => !/sample/i.test(piece.alt)), true);
});

test("the catalog is finished tattoos, not the room or the ink caps", () => {
  const ids = portfolio.map((piece) => piece.id);
  assert.equal(ids.includes("studio"), false);
  assert.equal(ids.includes("inks"), false);
  assert.equal(ids.includes("wrap"), false);
  assert.equal(ids.includes("wildflower"), true);
  assert.equal(ids.includes("rose"), true);
  assert.equal(ids.includes("band"), true);
});

test("filters combine artist, style, placement, and size, and a parent includes its sub-styles", () => {
  const floral = filterPieces(portfolio, { tags: ["botanical"] });
  assert.equal(floral.some((piece) => piece.id === "peony"), true);
  assert.equal(floral.some((piece) => piece.id === "fern"), true);
  assert.equal(floral.some((piece) => piece.id === "band"), false);

  const meagan = filterPieces(portfolio, { artistIds: ["meagan"] });
  assert.equal(meagan.every((piece) => piece.artistId === "meagan"), true);
  assert.equal(meagan.some((piece) => piece.id === "fox"), false);

  const thigh = filterPieces(portfolio, { placements: ["thigh"] });
  assert.deepEqual(thigh.map((piece) => piece.id), ["fox"]);

  const both = filterPieces(portfolio, {
    tags: ["fine-line", "insect"],
    artistIds: ["britt"],
  });
  assert.deepEqual(both.map((piece) => piece.id), ["moth"]);

  assert.equal(filterPieces(portfolio, { tags: ["fantasy"] }).length, 0);
  assert.equal(filterPieces(portfolio, { sizes: ["band"] }).every((piece) => piece.id === "band"), true);
  assert.equal(filterPieces(portfolio, { tags: ["color", "black-grey"] }).some((piece) => piece.id === "peony"), true);
});

test("search matches artist, style, keyword, placement, and size", () => {
  assert.deepEqual(
    filterPieces(portfolio, { query: "black and grey fox" }).map((piece) => piece.id),
    ["fox"],
  );
  assert.equal(
    filterPieces(portfolio, { query: "Meagan floral" }).every((piece) => piece.artistId === "meagan"),
    true,
  );
  assert.equal(filterPieces(portfolio, { query: "moon" }).some((piece) => piece.id === "moth"), true);
  assert.equal(filterPieces(portfolio, { query: "shoulder" }).some((piece) => piece.id === "rose"), true);
  assert.equal(filterPieces(portfolio, { query: "3/4 sleeve" }).length, 0);
  assert.equal(filterPieces(portfolio, { query: "religion" }).length, 0);
  assert.equal(filterPieces(portfolio, { query: "animals" }).some((piece) => piece.id === "fox"), true);
  assert.equal(artistName("meagan"), "Meagan Caprice");
  assert.equal(artistName(""), "");
});

test("the lists are ready for an artist, style, placement, or size that is not on a piece yet", () => {
  assert.deepEqual(
    artists.map((artist) => artist.name),
    ["Meagan Caprice", "Brittany Ostrander"],
  );
  assert.equal(locations.some((place) => place.id === "ankle"), true);
  assert.equal(sizes.some((size) => size.label === "Three-quarter sleeve"), true);
  assert.equal(sizes.some((size) => size.label === "Half sleeve"), true);
  assert.equal(sizes.some((size) => size.label === "Full sleeve"), true);
  const subjects = portfolioFacets.find((facet) => facet.id === "subject").options;
  assert.equal(subjects.some((option) => option.label === "Animals"), true);
  assert.equal(subjects.some((option) => option.label === "Religion"), true);
  const styles = portfolioFacets.find((facet) => facet.id === "style").options;
  assert.equal(styles.some((option) => option.children?.some((child) => child.id === "anime")), true);

  const future = {
    ...portfolio[0],
    id: "future",
    title: "Dragon",
    artistId: "future",
    tags: ["anime"],
    keywords: ["dragon"],
    placement: "ankle",
    size: "full-sleeve",
    filmStyle: "",
  };
  assert.deepEqual(filterPieces([future], { artistIds: ["future"] }).map((piece) => piece.id), ["future"]);
  assert.deepEqual(filterPieces([future], { tags: ["fantasy"] }).map((piece) => piece.id), ["future"]);
  assert.deepEqual(filterPieces([future], { placements: ["ankle"] }).map((piece) => piece.id), ["future"]);
  assert.equal(filterPieces([future], { query: "dragon" }).length, 1);
});

test("sort offers recently added, artist, style, and name", () => {
  assert.equal(sortPieces(portfolio, "newest")[0].id, "rose");
  assert.equal(sortPieces(portfolio, "oldest")[0].id, "peony");
  const byArtist = sortPieces(portfolio, "artist");
  assert.equal(byArtist.at(-1).id, "fox");
  assert.equal(byArtist[0].artistId, "britt");
  assert.equal(sortPieces(portfolio, "style")[0].id, "olive");
  const byName = sortPieces(portfolio, "name");
  assert.deepEqual(
    byName.map((piece) => piece.title),
    portfolio.map((piece) => piece.title).sort((left, right) => left.localeCompare(right)),
  );
  assert.equal(portfolioKeywords().includes("moon"), true);
});
