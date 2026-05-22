import * as THREE from "three";
import { injectSpeedInsights } from "@vercel/speed-insights";

const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

if (!isLocalHost) {
  injectSpeedInsights();
}

let storyData;
let stories = [];

const initialParams = new URLSearchParams(window.location.search);
const initialYear = initialParams.get("year");
const initialStorySlug = initialParams.get("story");

const THEME_COLORS = {
  Conservation: "#52d9ff",
  "Digital Humanities": "#b8a4ff",
  Environment: "#83f7b1",
  "Health and Safety": "#ff7b9c",
  "Humanitarian Response": "#ffd166",
  Infrastructure: "#f7b955",
  Nature: "#6ee7a8",
  People: "#ff7b9c",
  "Planning and Infrastructure": "#ffd166",
  Research: "#c7a8ff",
};

const elements = {
  canvas: document.querySelector("#globe"),
  labels: document.querySelector("#globe-labels"),
  count: document.querySelector("#story-count"),
  list: document.querySelector("#story-list"),
  yearButtons: [...document.querySelectorAll("[data-year]")],
  yearSelect: document.querySelector("#year-select"),
  basemapButtons: [...document.querySelectorAll("[data-basemap]")],
  category: document.querySelector("#active-category"),
  year: document.querySelector("#active-year"),
  title: document.querySelector("#active-title"),
  thumbnail: document.querySelector("#active-thumbnail"),
  summary: document.querySelector("#active-summary"),
  place: document.querySelector("#active-place"),
  strength: document.querySelector("#active-strength"),
  link: document.querySelector("#active-link"),
  autoplay: document.querySelector("#autoplay-button"),
  autoplayLabel: document.querySelector("#autoplay-label"),
  panelToggle: document.querySelector("#panel-toggle"),
  panel: document.querySelector(".story-panel"),
  health: document.querySelector("#render-health"),
  storyIndex: document.querySelector("#seo-story-index-list"),
  canonical: document.querySelector("#canonical-link"),
};

let activeYear = ["2026", "2025", "2024"].includes(initialYear)
  ? initialYear
  : "2026";
let visibleStories = [];
let activeStory;
let storyPins = [];
let storyLabels = [];
let pendingInitialStoryId = initialStorySlug;
const AUTOPLAY_INTERVAL = 10000;
const BASEMAPS = {
  dark: {
    texture: "./assets/world.jpg",
    opacity: 0.86,
    emissive: "#07111a",
    emissiveIntensity: 0.08,
    atmosphere: "#52d9ff",
    atmosphereOpacity: 0.075,
  },
  light: {
    texture: "./assets/world-light.jpeg",
    opacity: 0.92,
    emissive: "#f4f7f8",
    emissiveIntensity: 0.035,
    atmosphere: "#ffffff",
    atmosphereOpacity: 0.045,
  },
};
let autoplayEnabled = true;
let autoplayStartedAt = performance.now();
let autoplayTimerId;
let targetRotation = new THREE.Vector2(0.2, -0.35);
let pointerDown = false;
let previousPointer = new THREE.Vector2();
let isPanelCollapsed = false;
const thumbnailCache = new Map();
const basemapTextures = new Map();
let activeBasemap = "dark";

elements.count.textContent = "0";

const renderer = new THREE.WebGLRenderer({
  canvas: elements.canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0, 5.1);

const globeGroup = new THREE.Group();
scene.add(globeGroup);

const textureLoader = new THREE.TextureLoader();

function loadBasemapTexture(key) {
  if (basemapTextures.has(key)) {
    return basemapTextures.get(key);
  }
  const texture = textureLoader.load(BASEMAPS[key].texture, (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    loadedTexture.needsUpdate = true;
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  basemapTextures.set(key, texture);
  return texture;
}

const earthTexture = loadBasemapTexture(activeBasemap);
const globeMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  transparent: true,
  opacity: BASEMAPS.dark.opacity,
  roughness: 0.9,
  metalness: 0.02,
  emissive: new THREE.Color(BASEMAPS.dark.emissive),
  emissiveIntensity: BASEMAPS.dark.emissiveIntensity,
});

const globe = new THREE.Mesh(new THREE.SphereGeometry(1.45, 128, 64), globeMaterial);
globeGroup.add(globe);

function selectBasemap(key) {
  const basemap = BASEMAPS[key] ?? BASEMAPS.dark;
  activeBasemap = BASEMAPS[key] ? key : "dark";
  globeMaterial.map = loadBasemapTexture(activeBasemap);
  globeMaterial.opacity = basemap.opacity;
  globeMaterial.emissive.set(basemap.emissive);
  globeMaterial.emissiveIntensity = basemap.emissiveIntensity;
  globeMaterial.needsUpdate = true;
  atmosphere.material.color.set(basemap.atmosphere);
  atmosphere.material.opacity = basemap.atmosphereOpacity;
  elements.basemapButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.basemap === activeBasemap));
  });
}

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.49, 96, 96),
  new THREE.MeshBasicMaterial({
    color: "#52d9ff",
    transparent: true,
    opacity: 0.075,
    side: THREE.BackSide,
  }),
);
globeGroup.add(atmosphere);

const graticule = buildGraticule();
globeGroup.add(graticule);

const pinGroup = new THREE.Group();
globeGroup.add(pinGroup);

function createStoryPins() {
  storyPins = stories.map((story) => {
    const pin = createPin(story);
    pin.userData.story = story;
    pin.position.copy(latLonToVector(story.lat, story.lon, 1.55));
    pin.lookAt(pin.position.clone().multiplyScalar(2));
    pinGroup.add(pin);
    return pin;
  });
}

function createStoryLabels() {
  elements.labels.innerHTML = "";
  storyLabels = stories.map((story) => {
    const label = document.createElement("div");
    label.className = "globe-label";
    label.innerHTML = `<strong>${story.place}</strong><span>${story.title}</span>`;
    elements.labels.append(label);
    return { label, story };
  });
}

const stars = buildStars();
scene.add(stars);

const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
keyLight.position.set(-3.5, 2.8, 4);
scene.add(keyLight);
scene.add(new THREE.AmbientLight("#6aa6c9", 0.75));

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function buildGraticule() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: "#78d8ff",
    transparent: true,
    opacity: 0.14,
  });

  for (let lat = -60; lat <= 60; lat += 30) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 4) {
      points.push(latLonToVector(lat, lon, 1.462));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  for (let lon = -180; lon < 180; lon += 30) {
    const points = [];
    for (let lat = -86; lat <= 86; lat += 4) {
      points.push(latLonToVector(lat, lon, 1.462));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  return group;
}

function buildStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 1200; i += 1) {
    const radius = 18 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#dcecff",
      size: 0.025,
      transparent: true,
      opacity: 0.65,
    }),
  );
}

function createPin(story) {
  const group = new THREE.Group();
  const color = new THREE.Color(story.themeColor);
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 20, 20),
    new THREE.MeshBasicMaterial({
      color,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.045, 0.075, 36),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const stem = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -0.02),
      new THREE.Vector3(0, 0, -0.24),
    ]),
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      depthTest: false,
      depthWrite: false,
    }),
  );
  group.renderOrder = 10;
  halo.renderOrder = 11;
  base.renderOrder = 12;
  stem.renderOrder = 10;
  group.add(halo, base, stem);
  return group;
}

function latLonToVector(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function renderList() {
  elements.list.innerHTML = "";
  for (const story of visibleStories) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", story === activeStory ? "true" : "false");
    button.style.setProperty("--theme-color", story.themeColor);
    button.innerHTML = `
      <span class="card-title">${story.title}</span>
      <span class="card-meta"><span>${story.place}</span><span class="tag">${story.theme}</span></span>
    `;
    button.addEventListener("click", () => selectStory(story, true));
    item.append(button);
    elements.list.append(item);
  }
  elements.list.querySelector("[aria-current=\"true\"]")?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function renderStoryIndex() {
  elements.storyIndex.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const years = Object.keys(storyData).sort((a, b) => b.localeCompare(a));

  for (const year of years) {
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    const list = document.createElement("ol");
    heading.textContent = year;

    for (const story of stories.filter((entry) => entry.year === year)) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const meta = document.createElement("span");
      const summary = document.createElement("span");
      link.href = story.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = story.title;
      meta.textContent = `${story.theme} · ${story.place}`;
      summary.textContent = story.strength;
      item.append(link, meta, summary);
      list.append(item);
    }

    section.append(heading, list);
    fragment.append(section);
  }

  elements.storyIndex.append(fragment);
}

function selectStory(story, focusGlobe = false, resetAutoplay = true, updateLocation = true) {
  activeStory = story;
  if (resetAutoplay) {
    resetAutoplayTimer();
  }
  elements.category.textContent = story.theme;
  elements.year.textContent = story.award;
  elements.title.textContent = story.title;
  elements.summary.textContent = story.summary;
  elements.place.textContent = story.place;
  elements.strength.textContent = story.strength;
  elements.link.href = story.url;
  updateStoryThumbnail(story);
  storyPins.forEach((pin) => {
    const isActive = pin.userData.story === story;
    pin.visible = pin.userData.story.year === activeYear;
    pin.scale.setScalar(isActive ? 2.15 : 1);
    const [halo, base, stem] = pin.children;
    halo.material.opacity = isActive ? 0.95 : 0.22;
    base.material.color.set(isActive ? "#ffffff" : pin.userData.story.themeColor);
    stem.material.opacity = isActive ? 0.78 : 0.38;
  });
  storyLabels.forEach(({ label, story: labelStory }) => {
    const isActive = labelStory === story;
    label.classList.toggle("is-active", isActive);
    label.classList.remove("is-visible");
  });
  renderList();
  if (focusGlobe) {
    focusStory(story);
  }
  if (updateLocation) {
    updateUrlState();
  }
}

function getStoryItemId(story) {
  return story.url.match(/\/(?:stories|briefings|frames)\/([^/?#]+)/)?.[1] ?? "";
}

async function updateStoryThumbnail(story) {
  const itemId = getStoryItemId(story);
  elements.thumbnail.hidden = true;
  elements.thumbnail.removeAttribute("src");
  elements.thumbnail.dataset.storyUrl = story.url;

  if (!itemId) {
    return;
  }

  let thumbnailUrl = thumbnailCache.get(itemId);
  if (thumbnailUrl === undefined) {
    thumbnailUrl = "";
    try {
      const response = await fetch(`https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`);
      if (response.ok) {
        const item = await response.json();
        if (item.thumbnail) {
          thumbnailUrl = item.thumbnail.startsWith("http")
            ? item.thumbnail
            : `https://www.arcgis.com/sharing/rest/content/items/${itemId}/info/${item.thumbnail}`;
        }
      }
    } catch {
      thumbnailUrl = "";
    }
    thumbnailCache.set(itemId, thumbnailUrl);
  }

  if (!thumbnailUrl || elements.thumbnail.dataset.storyUrl !== story.url) {
    return;
  }

  elements.thumbnail.onload = () => {
    if (elements.thumbnail.dataset.storyUrl === story.url) {
      elements.thumbnail.hidden = false;
    }
  };
  elements.thumbnail.onerror = () => {
    if (elements.thumbnail.dataset.storyUrl === story.url) {
      elements.thumbnail.hidden = true;
      elements.thumbnail.removeAttribute("src");
    }
  };
  elements.thumbnail.src = thumbnailUrl;
}

function selectYear(year) {
  activeYear = year;
  resetAutoplayTimer();
  visibleStories = stories.filter((story) => story.year === activeYear);
  elements.count.textContent = visibleStories.length;
  elements.yearButtons.forEach((button) => {
    const isActive = button.dataset.year === activeYear;
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  elements.yearSelect.value = activeYear;
  if (visibleStories.length) {
    const requestedStoryId = pendingInitialStoryId;
    const requestedStory = visibleStories.find((story) => getStoryItemId(story) === requestedStoryId);
    selectStory(requestedStory ?? visibleStories[0], true);
    pendingInitialStoryId = "";
  }
}

function focusStory(story) {
  targetRotation.x = THREE.MathUtils.degToRad(story.lat);
  targetRotation.y = THREE.MathUtils.degToRad(-story.lon - 90);
}

function updateUrlState() {
  if (!activeStory) {
    return;
  }
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("year", activeYear);
  url.searchParams.set("story", getStoryItemId(activeStory));
  window.history.replaceState({}, "", url);
}

function setSeoMetadata() {
  const canonicalUrl = new URL(window.location.pathname, window.location.origin);
  const logoUrl = new URL("./assets/story-atlas-logo.png", window.location.href);
  elements.canonical.href = canonicalUrl.href;
  setMeta("property", "og:url", canonicalUrl.href);
  setMeta("property", "og:image", logoUrl.href);
  setMeta("name", "twitter:image", logoUrl.href);
  injectStructuredData(canonicalUrl.href);
}

function setMeta(attribute, name, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.append(tag);
  }
  tag.content = content;
}

function injectStructuredData(pageUrl) {
  const themes = [...new Set(stories.map((story) => story.theme))].sort();
  const places = [...new Set(stories.map((story) => story.place))].sort();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: "Story Atlas",
        url: pageUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        description:
          "An interactive 3D globe for discovering curated ArcGIS StoryMaps by year, theme, place, and storytelling highlight.",
        featureList: [
          "Interactive Three.js globe with story pins",
          "Year filters for 2026, 2025, and 2024 StoryMaps",
          "Story carousel with theme, place, and highlight metadata",
          "Direct links to original ArcGIS StoryMaps",
        ],
      },
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: "Story Atlas curated ArcGIS StoryMaps collection",
        url: pageUrl,
        description:
          "A curated collection of ArcGIS StoryMaps examples grouped by year with themes, places, coordinates, summaries, and storytelling highlights.",
        keywords: themes,
        temporalCoverage: "2024/2026",
        spatialCoverage: places.map((place) => ({
          "@type": "Place",
          name: place,
        })),
        isAccessibleForFree: true,
        variableMeasured: [
          "Story title",
          "Story year",
          "Theme",
          "Place",
          "Latitude",
          "Longitude",
          "Summary",
          "Highlight",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#stories`,
        name: "Curated ArcGIS StoryMaps in Story Atlas",
        numberOfItems: stories.length,
        itemListElement: stories.map((story, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: story.title,
            url: story.url,
            description: story.summary,
            genre: story.theme,
            temporalCoverage: story.year,
            contentLocation: {
              "@type": "Place",
              name: story.place,
              geo: {
                "@type": "GeoCoordinates",
                latitude: story.lat,
                longitude: story.lon,
              },
            },
            about: story.strength,
          },
        })),
      },
    ],
  };
  let script = document.querySelector("#story-atlas-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "story-atlas-structured-data";
    script.type = "application/ld+json";
    document.head.append(script);
  }
  script.textContent = JSON.stringify(graph);
}

function resetAutoplayTimer() {
  autoplayStartedAt = performance.now();
  updateAutoplayProgress(0);
  clearTimeout(autoplayTimerId);
  if (autoplayEnabled && visibleStories.length > 1) {
    autoplayTimerId = setTimeout(advanceStory, AUTOPLAY_INTERVAL);
  }
}

function setAutoplay(enabled) {
  autoplayEnabled = enabled;
  clearTimeout(autoplayTimerId);
  elements.autoplay.setAttribute("aria-pressed", String(enabled));
  const label = enabled ? "Pause" : "Play";
  elements.autoplayLabel.textContent = label;
  elements.autoplay.setAttribute("aria-label", enabled ? "Pause autoplay" : "Play autoplay");
  elements.autoplay.title = enabled ? "Pause autoplay" : "Play autoplay";
  const icon = elements.autoplay.querySelector(".pause-icon, .play-icon");
  icon.className = enabled ? "pause-icon" : "play-icon";
  elements.panel.classList.toggle("is-autoplaying", enabled);
  resetAutoplayTimer();
}

function setPanelCollapsed(collapsed) {
  isPanelCollapsed = collapsed;
  elements.panel.classList.toggle("is-collapsed", collapsed);
  elements.panelToggle.setAttribute("aria-expanded", String(!collapsed));
  elements.panelToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand story details" : "Collapse story details",
  );
  elements.panelToggle.title = collapsed ? "Expand story details" : "Collapse story details";
}

function updateAutoplayProgress(progress) {
  const percentage = `${Math.min(progress, 1) * 100}%`;
  elements.panel.style.setProperty("--autoplay-progress", percentage);
}

function advanceStory() {
  const currentIndex = visibleStories.indexOf(activeStory);
  const nextStory = visibleStories[(currentIndex + 1) % visibleStories.length];
  selectStory(nextStory, true, false);
  resetAutoplayTimer();
}
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.position.z = width < 760 ? 5.7 : 5.1;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function updateGlobeLabels() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  storyLabels.forEach(({ label, story }) => {
    if (story !== activeStory || story.year !== activeYear) {
      label.classList.remove("is-visible");
      return;
    }

    const position = latLonToVector(story.lat, story.lon, 1.64).applyEuler(globeGroup.rotation);
    const projected = position.clone().project(camera);
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
    label.style.zIndex = "4";
    label.classList.add("is-active");
    label.classList.add("is-visible");
  });
}

function setPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickPin(event) {
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(storyPins, true);
  const hit = hits.find((entry) => entry.object.parent?.userData.story?.year === activeYear);
  if (hit) {
    selectStory(hit.object.parent.userData.story, true);
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (autoplayEnabled && visibleStories.length > 1) {
    const elapsed = performance.now() - autoplayStartedAt;
    updateAutoplayProgress(elapsed / AUTOPLAY_INTERVAL);
  } else if (!autoplayEnabled) {
    updateAutoplayProgress(0);
  }
  globeGroup.rotation.x += (targetRotation.x - globeGroup.rotation.x) * 0.045;
  globeGroup.rotation.y += (targetRotation.y - globeGroup.rotation.y) * 0.045;
  stars.rotation.y += 0.00015;
  storyPins.forEach((pin, index) => {
    const isActive = pin.userData.story === activeStory;
    const pulse = isActive ? 1 + Math.sin(performance.now() * 0.003 + index) * 0.08 : 1;
    pin.children[0].scale.setScalar(pulse);
  });
  updateGlobeLabels();
  renderer.render(scene, camera);
  if (elements.health.textContent !== "Three.js render active") {
    elements.health.textContent = "Three.js render active";
    elements.canvas.dataset.rendered = "true";
  }
}

window.addEventListener("resize", resize);
elements.yearButtons.forEach((button) => {
  button.addEventListener("click", () => selectYear(button.dataset.year));
});
elements.yearSelect.addEventListener("change", () => selectYear(elements.yearSelect.value));
elements.basemapButtons.forEach((button) => {
  button.addEventListener("click", () => selectBasemap(button.dataset.basemap));
});
elements.autoplay.addEventListener("click", () => setAutoplay(!autoplayEnabled));
elements.panelToggle.addEventListener("click", () => setPanelCollapsed(!isPanelCollapsed));
elements.link.addEventListener("click", () => setAutoplay(false));
elements.canvas.addEventListener("click", pickPin);
elements.canvas.addEventListener("pointerdown", (event) => {
  pointerDown = true;
  previousPointer.set(event.clientX, event.clientY);
});
window.addEventListener("pointerup", () => {
  pointerDown = false;
});
window.addEventListener("pointermove", (event) => {
  if (!pointerDown) return;
  const dx = event.clientX - previousPointer.x;
  const dy = event.clientY - previousPointer.y;
  targetRotation.y += dx * 0.006;
  targetRotation.x += dy * 0.004;
  targetRotation.x = THREE.MathUtils.clamp(targetRotation.x, -1.1, 1.1);
  previousPointer.set(event.clientX, event.clientY);
});

async function loadStories() {
  const response = await fetch("./stories.json");
  if (!response.ok) {
    throw new Error(`Could not load stories.json: ${response.status}`);
  }
  storyData = await response.json();
  stories = Object.entries(storyData).flatMap(([year, entries]) =>
    entries.map((story) => ({
      ...story,
      year,
      themeColor: THEME_COLORS[story.theme] ?? story.color,
    })),
  );
  createStoryPins();
  createStoryLabels();
  renderStoryIndex();
  setSeoMetadata();
  selectYear(activeYear);
  setAutoplay(true);
}

resize();
loadStories().catch((error) => {
  console.error(error);
  elements.title.textContent = "Could not load stories";
  elements.summary.textContent = "Check stories.json and reload the app.";
});
animate();
