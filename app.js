import * as THREE from "three";

const stories = [
  {
    title: "A Fight for Survival",
    place: "South America",
    lat: -10,
    lon: -62,
    theme: "Environment",
    year: "2026",
    award: "2026 winner",
    url: "https://storymaps.arcgis.com/stories/abf6ac19ba9442a7b7594eaf944ca6d0",
    summary:
      "An award-winning story about isolated Indigenous peoples, biodiversity, and threats across South America.",
    strength: "Anchored scale, dynamic maps, call to action",
    color: "#83f7b1",
  },
  {
    title: "The Migration of Humpback Whales",
    place: "North Atlantic",
    lat: 43,
    lon: -48,
    theme: "Environment",
    year: "2026",
    award: "2026 student winner",
    url: "https://storymaps.arcgis.com/stories/68e2267c6b264da1bce80858afd8c8ea",
    summary:
      "A student winner recognized for turning migration data into a graceful, highly readable narrative experience.",
    strength: "Timeline pacing, app integration, immersion",
    color: "#52d9ff",
  },
  {
    title: "The Pacheco Pass Wildlife Overcrossing Project",
    place: "California, United States",
    lat: 37.05,
    lon: -121.28,
    theme: "Infrastructure",
    year: "2026",
    award: "2026 winner",
    url: "https://storymaps.arcgis.com/stories/c10f0ba992b742d7bdd00565a1ad8407",
    summary:
      "A transportation and habitat-connectivity story that centers wildlife movement around a highway crossing.",
    strength: "Narrative voice, map design, visual balance",
    color: "#ffd166",
  },
  {
    title: "From Ashes to Action",
    place: "Altadena, United States",
    lat: 34.19,
    lon: -118.13,
    theme: "Infrastructure",
    year: "2026",
    award: "2026 student winner",
    url: "https://storymaps.arcgis.com/stories/85bff3144ac048faae7432be7e494d5c",
    summary:
      "A post-disaster infrastructure revival story using archives, assistance workflows, and local resilience mapping.",
    strength: "Detail, civic utility, geographic approach",
    color: "#ff7b9c",
  },
  {
    title: "Dear Diary, Adulting Just Got Too Expensive",
    place: "Global",
    lat: 20,
    lon: 10,
    theme: "People",
    year: "2026",
    award: "2026 winner",
    url: "https://storymaps.arcgis.com/stories/59b6122a17de4597a85e79d94064a2c4",
    summary:
      "A personal data story about economic pressure and sandwich-generation responsibilities.",
    strength: "Animations, personal framing, survey integration",
    color: "#ff7b9c",
  },
  {
    title: "NPU Voices in Action",
    place: "Atlanta, United States",
    lat: 33.75,
    lon: -84.39,
    theme: "People",
    year: "2026",
    award: "2026 student winner",
    url: "https://storymaps.arcgis.com/stories/36a8c82e9cfd4b1eb991ae9efc6f1dbd",
    summary:
      "A community-planning story about Atlanta's neighborhood planning unit system and public participation.",
    strength: "Community voices, clean pop-ups, map tours",
    color: "#b8a4ff",
  },
  {
    title: "Mapping Chattanooga's Urban Forests",
    place: "Tennessee, United States",
    lat: 35.04,
    lon: -85.31,
    theme: "Environment",
    year: "2026",
    award: "2026 innovation",
    url: "https://storymaps.arcgis.com/stories/6c80d339992b4d279ae4f7fd2b0bdd61",
    summary:
      "A GeoAI urban canopy story that explains where thousands of new trees can do the most good.",
    strength: "Swipe blocks, charts, analytical storytelling",
    color: "#83f7b1",
  },
  {
    title: "Connections to Long Island Sound",
    place: "Connecticut, United States",
    lat: 41.2,
    lon: -72.9,
    theme: "People",
    year: "2026",
    award: "2026 innovation",
    url: "https://storymaps.arcgis.com/stories/1d4b55a254524c34a458ff7384de8028",
    summary:
      "A watershed story that uses Living Atlas content to explain land, water, and people around Long Island Sound.",
    strength: "Map orchestration, localized Living Atlas layers",
    color: "#52d9ff",
  },
  {
    title: "Ceara Green Hydrogen Platform",
    place: "Ceara, Brazil",
    lat: -3.73,
    lon: -38.52,
    theme: "Infrastructure",
    year: "2026",
    award: "2026 community choice",
    url: "https://storymaps.arcgis.com/stories/8a2ac7e372e34a48ba3ca7fd36908541",
    summary:
      "A community-choice infrastructure story with custom theming, cohesive infographics, web maps, and a map tour.",
    strength: "Custom theme, infographics, map tour",
    color: "#ffd166",
  },
  {
    title: "Tucson Equity Priority Index",
    place: "Arizona, United States",
    lat: 32.22,
    lon: -110.97,
    theme: "Health and Safety",
    year: "2025",
    award: "2025 grand prize",
    url: "https://storymaps.arcgis.com/stories/9a0ab238488240d6b4fad20a50b1d795",
    summary:
      "A health-equity story that turns social vulnerability data into a community investment tool.",
    strength: "Illustration, civic data, approachable analysis",
    color: "#ff7b9c",
  },
  {
    title: "Braceros Across the United States-Mexico Border",
    place: "United States and Mexico",
    lat: 29,
    lon: -104,
    theme: "Digital Humanities",
    year: "2025",
    award: "2025 winner",
    url: "https://storymaps.arcgis.com/stories/4a2e09dcc5474a12a34993ec8eb06620",
    summary:
      "A humanities story honoring Mexican farmworkers through mapped migration, memory, and oral history.",
    strength: "Community voice, archival media, spatial history",
    color: "#b8a4ff",
  },
  {
    title: "Drone-Based Aerial Mapping of Landslide",
    place: "Nepal",
    lat: 28.39,
    lon: 84.12,
    theme: "Humanitarian Response",
    year: "2025",
    award: "2025 winner",
    url: "https://storymaps.arcgis.com/stories/f464c97b68d74f408a3a69d163cf21bd",
    summary:
      "A disaster-response story showing how drone imagery can reveal landslide change and debris volume.",
    strength: "Remote sensing, before-after evidence, risk framing",
    color: "#ffd166",
  },
  {
    title: "The Climate Puzzle",
    place: "Global mangroves",
    lat: 4,
    lon: 102,
    theme: "Humanitarian Response",
    year: "2025",
    award: "2025 student grand prize",
    url: "https://storymaps.arcgis.com/stories/af2d58e77c0848b48f7a797efebccd24",
    summary:
      "A student grand-prize story connecting mangroves, flood risk, pollution, and public health.",
    strength: "Global case studies, clear maps, strong narrative arc",
    color: "#83f7b1",
  },
  {
    title: "Charting a Path to Human-Elephant Coexistence",
    place: "Tanzania",
    lat: -6.37,
    lon: 34.89,
    theme: "Nature",
    year: "2025",
    award: "2025 winner",
    url: "https://storymaps.arcgis.com/stories/6cf68501c25f470fbf27faf2a84f704d",
    summary:
      "A conservation story about communities using GIS to support elephant habitat connectivity.",
    strength: "Accessible writing, conservation outcomes, field context",
    color: "#83f7b1",
  },
  {
    title: "Crossing Nets",
    place: "Catalonia, Spain",
    lat: 41.7,
    lon: 2.8,
    theme: "Nature",
    year: "2025",
    award: "2025 student winner",
    url: "https://storymaps.arcgis.com/stories/7fcee8a5b0ce42cf946fb91ccba3e98c",
    summary:
      "A loggerhead turtle's journey through bycatch risk, told through maps, photos, video, and audio.",
    strength: "Point-of-view storytelling, multimedia, conservation data",
    color: "#52d9ff",
  },
  {
    title: "Breaking Point",
    place: "Tribal forests, United States",
    lat: 45,
    lon: -112,
    theme: "Planning and Infrastructure",
    year: "2025",
    award: "2025 winner",
    url: "https://storymaps.arcgis.com/stories/c1f1ca11f6774341b70550e8b8cc1801",
    summary:
      "A planning story about the state of tribal forestry and the infrastructure needed for better stewardship.",
    strength: "3D graphics, collaborative framing, policy clarity",
    color: "#ffd166",
  },
  {
    title: "Martin County Ditch No. 28 Treatment Train",
    place: "Minnesota, United States",
    lat: 43.65,
    lon: -94.46,
    theme: "Planning and Infrastructure",
    year: "2025",
    award: "2025 student winner",
    url: "https://storymaps.arcgis.com/stories/253fc3cc2a084c1f8738e5d9596da107",
    summary:
      "A student infrastructure story about water quality, farm drainage, and nutrient treatment.",
    strength: "Local systems, environmental infrastructure, clear outcomes",
    color: "#52d9ff",
  },
  {
    title: "Advancing Accessible Healthcare in Boston",
    place: "Massachusetts, United States",
    lat: 42.36,
    lon: -71.06,
    theme: "Health and Safety",
    year: "2025",
    award: "2025 student winner",
    url: "https://storymaps.arcgis.com/stories/94315ac008b947f9b1cafa930b01832f",
    summary:
      "A student story using geography to understand access to health care in Boston.",
    strength: "Equity lens, urban analysis, service access",
    color: "#ff7b9c",
  },
  {
    title: "A River Interrupted",
    place: "Massachusetts, United States",
    lat: 42.37,
    lon: -71.18,
    theme: "Conservation",
    year: "2024",
    award: "2024 winner",
    url: "https://storymaps.arcgis.com/stories/62917edcb76c4e10868cbb7a79638282",
    summary:
      "A river-restoration story about why removing defunct dams matters for the Charles River.",
    strength: "Local conservation, clear stakes, restoration narrative",
    color: "#52d9ff",
  },
  {
    title: "Living Territories",
    place: "Colombia",
    lat: 4.57,
    lon: -74.3,
    theme: "Conservation",
    year: "2024",
    award: "2024 runner up",
    url: "https://storymaps.arcgis.com/stories/6fa6d4807842404187981cc218bf4394",
    summary:
      "A territorial justice story about Indigenous lands, biodiversity, and conservation corridors.",
    strength: "Sidecar design, community context, territorial maps",
    color: "#83f7b1",
  },
  {
    title: "Recovering Lost Crab Pots of the Salish Sea",
    place: "Washington, United States",
    lat: 48.1,
    lon: -122.8,
    theme: "Conservation",
    year: "2024",
    award: "2024 student winner",
    url: "https://storymaps.arcgis.com/stories/1befb7cae32f49e89d8595d8ae884d38",
    summary:
      "A student conservation story about locating and recovering lost crab pots in the Salish Sea.",
    strength: "Marine debris, student research, precise mapping",
    color: "#52d9ff",
  },
  {
    title: "Ambassadors of the Amazon",
    place: "Amazon Basin",
    lat: -2.2,
    lon: -66,
    theme: "Research",
    year: "2024",
    award: "2024 winner",
    url: "https://storymaps.arcgis.com/stories/d995fb44a447430295786a51c3253120",
    summary:
      "A research story connecting Amazon conservation, field science, and place-based storytelling.",
    strength: "Scientific context, regional scale, field narrative",
    color: "#83f7b1",
  },
  {
    title: "2022 Annual Report",
    place: "Global biodiversity",
    lat: 15,
    lon: -20,
    theme: "Research",
    year: "2024",
    award: "2024 runner up",
    url: "https://storymaps.arcgis.com/stories/75248c2998a2411e96fbe269edfe8620",
    summary:
      "A science-focused annual report format that uses spatial storytelling to explain biodiversity work.",
    strength: "Report structure, data narrative, conservation scope",
    color: "#b8a4ff",
  },
  {
    title: "Satellites and Seeds",
    place: "Africa",
    lat: 1,
    lon: 32,
    theme: "Research",
    year: "2024",
    award: "2024 runner up",
    url: "https://storymaps.arcgis.com/stories/ca3867611cbc4547a8a14ecaa06d8161",
    summary:
      "A research story about remote sensing, agriculture, and seed systems.",
    strength: "Satellite context, applied science, development lens",
    color: "#ffd166",
  },
  {
    title: "Wind Erosion",
    place: "Czech Republic",
    lat: 49.2,
    lon: 16.6,
    theme: "Research",
    year: "2024",
    award: "2024 student winner",
    url: "https://storymaps.arcgis.com/stories/c3bdb3174746476780d4547e5eea4ebd",
    summary:
      "A student research story about wind erosion risk and agricultural landscapes.",
    strength: "Focused analysis, physical geography, map-based evidence",
    color: "#ff7b9c",
  },
];

const elements = {
  canvas: document.querySelector("#globe"),
  labels: document.querySelector("#globe-labels"),
  count: document.querySelector("#story-count"),
  list: document.querySelector("#story-list"),
  yearButtons: [...document.querySelectorAll("[data-year]")],
  category: document.querySelector("#active-category"),
  year: document.querySelector("#active-year"),
  title: document.querySelector("#active-title"),
  summary: document.querySelector("#active-summary"),
  place: document.querySelector("#active-place"),
  strength: document.querySelector("#active-strength"),
  link: document.querySelector("#active-link"),
  focus: document.querySelector("#focus-button"),
  health: document.querySelector("#render-health"),
};

let activeYear = "2026";
let visibleStories = stories.filter((story) => story.year === activeYear);
let activeStory = visibleStories[0];
let targetRotation = new THREE.Vector2(0.2, -0.35);
let pointerDown = false;
let previousPointer = new THREE.Vector2();

elements.count.textContent = visibleStories.length;

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

const texture = createEarthTexture();
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1.45, 96, 96),
  new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.68,
    roughness: 0.78,
    metalness: 0.06,
    emissive: new THREE.Color("#07111a"),
    emissiveIntensity: 0.14,
  }),
);
globeGroup.add(globe);

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

const storyPins = stories.map((story) => {
  const pin = createPin(story);
  pin.userData.story = story;
  pin.position.copy(latLonToVector(story.lat, story.lon, 1.55));
  pin.lookAt(pin.position.clone().multiplyScalar(2));
  pinGroup.add(pin);
  return pin;
});

const storyLabels = stories.map((story) => {
  const label = document.createElement("div");
  label.className = "globe-label";
  label.innerHTML = `<strong>${story.place}</strong><span>${story.title}</span>`;
  elements.labels.append(label);
  return { label, story };
});

const stars = buildStars();
scene.add(stars);

const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
keyLight.position.set(-3.5, 2.8, 4);
scene.add(keyLight);
scene.add(new THREE.AmbientLight("#6aa6c9", 0.75));

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const countryBoundaries = [
    [[-124, 49], [-101, 49], [-95, 49], [-67, 47]],
    [[-117, 32], [-106, 31], [-97, 26], [-83, 22]],
    [[-78, 8], [-70, 2], [-65, -8], [-62, -17]],
    [[-70, -18], [-64, -26], [-60, -36], [-58, -48]],
    [[-5, 43], [2, 46], [10, 47], [16, 49], [24, 52]],
    [[-8, 36], [2, 35], [10, 36], [22, 39], [30, 41]],
    [[10, 31], [17, 20], [20, 8], [25, 0], [30, -10]],
    [[-6, 15], [8, 13], [20, 12], [34, 10], [42, 6]],
    [[28, 31], [40, 32], [50, 29], [61, 26], [70, 24]],
    [[67, 36], [75, 32], [84, 28], [92, 26], [100, 24]],
    [[78, 8], [88, 18], [98, 22], [108, 24], [118, 27]],
    [[102, 48], [116, 46], [128, 43], [142, 48]],
    [[112, -22], [128, -25], [142, -30], [151, -35]],
  ];

  ctx.save();
  ctx.strokeStyle = "rgba(198, 224, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([7, 9]);
  for (const line of countryBoundaries) {
    drawGeoLine(ctx, line, canvas);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function project(lon, lat, canvas) {
  return {
    x: ((lon + 180) / 360) * canvas.width,
    y: ((90 - lat) / 180) * canvas.height,
  };
}

function drawGeoLine(ctx, line, canvas) {
  ctx.beginPath();
  line.forEach(([lon, lat], index) => {
    const { x, y } = project(lon, lat, canvas);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
}

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
  const color = new THREE.Color(story.color);
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 20, 20),
    new THREE.MeshBasicMaterial({ color }),
  );
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.045, 0.075, 36),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    }),
  );
  const stem = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -0.02),
      new THREE.Vector3(0, 0, -0.24),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 }),
  );
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
    button.innerHTML = `
      <span class="card-title">${story.title}</span>
      <span class="card-meta"><span>${story.place}</span><span class="tag">${story.theme}</span></span>
    `;
    button.addEventListener("click", () => selectStory(story, true));
    item.append(button);
    elements.list.append(item);
  }
}

function selectStory(story, focusGlobe = false) {
  activeStory = story;
  elements.category.textContent = story.theme;
  elements.year.textContent = story.award;
  elements.title.textContent = story.title;
  elements.summary.textContent = story.summary;
  elements.place.textContent = story.place;
  elements.strength.textContent = story.strength;
  elements.link.href = story.url;
  storyPins.forEach((pin) => {
    const isActive = pin.userData.story === story;
    pin.visible = pin.userData.story.year === activeYear;
    pin.scale.setScalar(isActive ? 1.75 : 1);
    pin.children[0].material.opacity = isActive ? 0.82 : 0.42;
  });
  storyLabels.forEach(({ label, story: labelStory }) => {
    const isActive = labelStory === story;
    label.classList.toggle("is-active", isActive);
    label.classList.toggle("is-visible", false);
  });
  renderList();
  if (focusGlobe) {
    focusStory(story);
  }
}

function selectYear(year) {
  activeYear = year;
  visibleStories = stories.filter((story) => story.year === activeYear);
  elements.count.textContent = visibleStories.length;
  elements.yearButtons.forEach((button) => {
    const isActive = button.dataset.year === activeYear;
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  if (visibleStories.length) {
    selectStory(visibleStories[0], true);
  }
}

function focusStory(story) {
  targetRotation.x = THREE.MathUtils.degToRad(story.lat);
  targetRotation.y = THREE.MathUtils.degToRad(story.lon - 90);
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
  const center = new THREE.Vector3();
  camera.getWorldDirection(center);

  storyLabels.forEach(({ label, story }) => {
    if (story !== activeStory || story.year !== activeYear) {
      label.classList.remove("is-visible");
      return;
    }

    const position = latLonToVector(story.lat, story.lon, 1.64).applyEuler(globeGroup.rotation);
    const onFront = position.dot(center) < -0.08;

    if (!onFront) {
      label.classList.remove("is-visible");
      return;
    }

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
elements.focus.addEventListener("click", () => focusStory(activeStory));
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

resize();
selectYear(activeYear);
animate();
