const PROMPTS_PER_PAGE = 10;

let allPrompts = [];
let currentPage = 1;

const promptsList = document.getElementById("prompts-list");
const emptyState = document.getElementById("empty-state");
const pageIndicator = document.getElementById("page-indicator");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const searchInput = document.getElementById("search-input");
const filterRating = document.getElementById("filter-rating");
const filterCategory = document.getElementById("filter-category");
const sortBy = document.getElementById("sort-by");

async function fetchPrompts() {
  const response = await fetch("/api/prompts");
  if (!response.ok) {
    console.error("Fetch failed:", response.status, await response.text());
    return;
  }
  const data = await response.json();
  allPrompts = data;
  populateCategories(data);
  render();
}

function calcAverage(rating) {
  if (!rating) return 0;

  let totalStars = 0;
  let totalVotes = 0;

  for (let star = 1; star <= 5; star++) {
    const count = rating[star] ?? 0;
    totalStars += star * count;
    totalVotes += count;
  }

  if (totalVotes === 0) return 0;
  return totalStars / totalVotes;
}

function populateCategories(prompts) {
  const allUses = [];

  for (const prompt of prompts) {
    if (prompt.use) {
      allUses.push(prompt.use);
    }
  }

  const uniqueUses = [];
  const seen = new Set();

  for (const use of allUses) {
    if (!seen.has(use)) {
      seen.add(use);
      uniqueUses.push(use);
    }
  }

  for (const use of uniqueUses) {
    const option = document.createElement("option");
    option.value = use;
    option.textContent = use.length > 10 ? use.slice(0, 10) + "..." : use;
    filterCategory.appendChild(option);
  }
}

function getFiltered() {
  const search = searchInput.value.trim().toLowerCase();
  const minRating = parseFloat(filterRating.value) || 0;
  const category = filterCategory.value;
  const sort = sortBy.value;

  let results = allPrompts.filter((p) => {
    const matchesSearch =
      !search || (p.use ?? "").toLowerCase().includes(search);
    const matchesRating = calcAverage(p.rating) >= minRating;
    const matchesCategory = !category || p.use === category;
    return matchesSearch && matchesRating && matchesCategory;
  });

  if (sort === "rating-desc")
    results.sort((a, b) => calcAverage(b.rating) - calcAverage(a.rating));
  if (sort === "rating-asc")
    results.sort((a, b) => calcAverage(a.rating) - calcAverage(b.rating));

  return results;
}

function buildStars(promptId, userRating) {
  const group = document.createElement("div");
  group.className = "star-group";

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.className = "star-btn";
    btn.setAttribute("aria-label", `Rate ${i} star${i > 1 ? "s" : ""}`);
    btn.dataset.value = i;

    const img = document.createElement("img");
    img.className = "star-icon";
    img.src =
      i <= userRating ? "../public/star.svg" : "../public/empty-star.svg";
    img.alt = "";
    btn.appendChild(img);

    btn.addEventListener("click", () => ratePrompt(promptId, i, group));
    group.appendChild(btn);
  }

  return group;
}

async function ratePrompt(promptId, value, starGroup) {
  starGroup.querySelectorAll(".star-btn").forEach((btn) => {
    const img = btn.querySelector(".star-icon");
    img.src =
      parseInt(btn.dataset.value) <= value
        ? "../public/star.svg"
        : "../public/empty-star.svg";
  });

  const prompt = allPrompts.find((p) => String(p._id) === String(promptId));
  if (prompt) {
    if (!prompt.rating) prompt.rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    prompt.rating[value] = (prompt.rating[value] ?? 0) + 1;
  }

  await fetch("/api/rate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptId, rating: value }),
  });

  setTimeout(() => render(), 600);
}

async function deletePrompt(promptId) {
  await fetch("/api/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptId }),
  });

  allPrompts = allPrompts.filter((p) => p._id !== promptId);
  currentPage = 1;
  render();
}

function buildPromptRow(prompt) {
  const row = document.createElement("div");
  row.className = "prompt-row";
  row.dataset.id = prompt._id;

  const ratingCol = document.createElement("div");
  ratingCol.className = "prompt-rating";
  ratingCol.textContent = `${calcAverage(prompt.rating).toFixed(1)}/5.0`;

  const contentCol = document.createElement("div");
  contentCol.className = "prompt-content";

  const text = document.createElement("p");
  text.className = "prompt-text";
  text.textContent = prompt.prompt;

  const actions = document.createElement("div");
  actions.className = "prompt-actions";

  const rateLabel = document.createElement("span");
  rateLabel.className = "rate-label";
  rateLabel.textContent = "Rate it:";

  const stars = buildStars(prompt._id, prompt.userRating ?? 0);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.setAttribute("aria-label", "Delete prompt");

  const trashIcon = document.createElement("img");
  trashIcon.src = "../public/trash.svg";
  trashIcon.alt = "Delete Button";
  trashIcon.className = "delete-icon";
  deleteBtn.appendChild(trashIcon);

  deleteBtn.addEventListener("click", () => deletePrompt(prompt._id));

  const tags = document.createElement("div");
  tags.className = "category-tags";
  if (prompt.use) {
    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.textContent = prompt.use;
    tags.appendChild(tag);
  }

  actions.appendChild(rateLabel);
  actions.appendChild(stars);
  actions.appendChild(deleteBtn);
  actions.appendChild(tags);

  contentCol.appendChild(text);
  contentCol.appendChild(actions);

  row.appendChild(ratingCol);
  row.appendChild(contentCol);

  return row;
}

function render() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PROMPTS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PROMPTS_PER_PAGE;
  const pageItems = filtered.slice(start, start + PROMPTS_PER_PAGE);

  promptsList.innerHTML = "";

  if (pageItems.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
    pageItems.forEach((p) => promptsList.appendChild(buildPromptRow(p)));
  }

  pageIndicator.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  render();
});
filterRating.addEventListener("change", () => {
  currentPage = 1;
  render();
});
filterCategory.addEventListener("change", () => {
  currentPage = 1;
  render();
});
sortBy.addEventListener("change", () => {
  currentPage = 1;
  render();
});

prevBtn.addEventListener("click", () => {
  currentPage -= 1;
  render();
});
nextBtn.addEventListener("click", () => {
  currentPage += 1;
  render();
});

fetchPrompts();
