// Cesium Sandcastle - Dynamic Star Map with Constellations
// Renders stars as canvas overlay with proper horizon culling + OSM Buildings

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: await Cesium.createWorldTerrainAsync(),
  skyBox: false,
  skyAtmosphere: false,
  sun: true,
  moon: true,
});

viewer.scene.globe.enableLighting = true;
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// ============================================
// OSM BUILDINGS
// ============================================
let osmBuildings = null;
let buildingsEnabled = false;

async function toggleBuildings() {
  if (buildingsEnabled) {
    // Remove buildings
    if (osmBuildings) {
      viewer.scene.primitives.remove(osmBuildings);
      osmBuildings = null;
    }
    buildingsEnabled = false;
  } else {
    // Add buildings
    osmBuildings = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(osmBuildings);
    buildingsEnabled = true;
  }
  return buildingsEnabled;
}

// ============================================
// STAR CATALOG WITH CONSTELLATION ASSIGNMENTS
// ============================================
const starCatalog = [
  // ORION
  { id: "betelgeuse", name: "Betelgeuse", ra: 88.793, dec: 7.407, mag: 0.42, temp: 3500, constellation: "Orion" },
  { id: "rigel", name: "Rigel", ra: 78.634, dec: -8.202, mag: 0.13, temp: 12100, constellation: "Orion" },
  { id: "bellatrix", name: "Bellatrix", ra: 81.283, dec: 6.350, mag: 1.64, temp: 22000, constellation: "Orion" },
  { id: "saiph", name: "Saiph", ra: 86.939, dec: -9.670, mag: 2.09, temp: 26000, constellation: "Orion" },
  { id: "alnilam", name: "Alnilam", ra: 84.053, dec: -1.202, mag: 1.69, temp: 27000, constellation: "Orion" },
  { id: "alnitak", name: "Alnitak", ra: 85.190, dec: -1.943, mag: 1.77, temp: 33000, constellation: "Orion" },
  { id: "mintaka", name: "Mintaka", ra: 83.001, dec: -0.299, mag: 2.23, temp: 31000, constellation: "Orion" },

  // BIG DIPPER / URSA MAJOR
  { id: "dubhe", name: "Dubhe", ra: 165.932, dec: 61.751, mag: 1.79, temp: 4660, constellation: "Big Dipper" },
  { id: "merak", name: "Merak", ra: 165.460, dec: 56.382, mag: 2.37, temp: 9377, constellation: "Big Dipper" },
  { id: "phecda", name: "Phecda", ra: 178.458, dec: 53.695, mag: 2.44, temp: 9355, constellation: "Big Dipper" },
  { id: "megrez", name: "Megrez", ra: 183.856, dec: 57.033, mag: 3.31, temp: 9480, constellation: "Big Dipper" },
  { id: "alioth", name: "Alioth", ra: 193.507, dec: 55.960, mag: 1.77, temp: 9020, constellation: "Big Dipper" },
  { id: "mizar", name: "Mizar", ra: 200.981, dec: 54.925, mag: 2.04, temp: 9000, constellation: "Big Dipper" },
  { id: "alkaid", name: "Alkaid", ra: 206.885, dec: 49.313, mag: 1.86, temp: 15540, constellation: "Big Dipper" },

  // LITTLE DIPPER / URSA MINOR
  { id: "polaris", name: "Polaris", ra: 37.954, dec: 89.264, mag: 2.02, temp: 6015, constellation: "Little Dipper" },
  { id: "kochab", name: "Kochab", ra: 222.676, dec: 74.155, mag: 2.08, temp: 4030, constellation: "Little Dipper" },
  { id: "pherkad", name: "Pherkad", ra: 230.182, dec: 71.834, mag: 3.00, temp: 8600, constellation: "Little Dipper" },

  // CASSIOPEIA
  { id: "schedar", name: "Schedar", ra: 10.127, dec: 56.537, mag: 2.24, temp: 4530, constellation: "Cassiopeia" },
  { id: "caph", name: "Caph", ra: 2.295, dec: 59.150, mag: 2.28, temp: 7079, constellation: "Cassiopeia" },
  { id: "gamma_cas", name: "Gamma Cas", ra: 14.177, dec: 60.717, mag: 2.47, temp: 25000, constellation: "Cassiopeia" },
  { id: "ruchbah", name: "Ruchbah", ra: 21.454, dec: 60.235, mag: 2.68, temp: 8400, constellation: "Cassiopeia" },
  { id: "segin", name: "Segin", ra: 28.599, dec: 63.670, mag: 3.37, temp: 15000, constellation: "Cassiopeia" },

  // CYGNUS (Swan)
  { id: "deneb", name: "Deneb", ra: 310.358, dec: 45.280, mag: 1.25, temp: 8525, constellation: "Cygnus" },
  { id: "sadr", name: "Sadr", ra: 305.557, dec: 40.257, mag: 2.23, temp: 5800, constellation: "Cygnus" },
  { id: "gienah_cyg", name: "Gienah", ra: 305.253, dec: 33.970, mag: 2.48, temp: 4700, constellation: "Cygnus" },
  { id: "albireo", name: "Albireo", ra: 292.680, dec: 27.960, mag: 3.08, temp: 4400, constellation: "Cygnus" },

  // LYRA
  { id: "vega", name: "Vega", ra: 279.235, dec: 38.784, mag: 0.03, temp: 9602, constellation: "Lyra" },
  { id: "sheliak", name: "Sheliak", ra: 282.520, dec: 33.363, mag: 3.52, temp: 13000, constellation: "Lyra" },
  { id: "sulafat", name: "Sulafat", ra: 284.736, dec: 32.690, mag: 3.24, temp: 10000, constellation: "Lyra" },

  // AQUILA (Eagle)
  { id: "altair", name: "Altair", ra: 297.696, dec: 8.868, mag: 0.76, temp: 7550, constellation: "Aquila" },
  { id: "tarazed", name: "Tarazed", ra: 296.565, dec: 10.613, mag: 2.72, temp: 4200, constellation: "Aquila" },
  { id: "alshain", name: "Alshain", ra: 298.828, dec: 6.407, mag: 3.71, temp: 6100, constellation: "Aquila" },

  // SCORPIUS
  { id: "antares", name: "Antares", ra: 247.352, dec: -26.432, mag: 0.96, temp: 3570, constellation: "Scorpius" },
  { id: "shaula", name: "Shaula", ra: 263.402, dec: -37.104, mag: 1.63, temp: 25000, constellation: "Scorpius" },
  { id: "sargas", name: "Sargas", ra: 264.330, dec: -42.998, mag: 1.87, temp: 6400, constellation: "Scorpius" },
  { id: "dschubba", name: "Dschubba", ra: 240.083, dec: -22.622, mag: 2.29, temp: 28000, constellation: "Scorpius" },

  // LEO
  { id: "regulus", name: "Regulus", ra: 152.093, dec: 11.967, mag: 1.40, temp: 12460, constellation: "Leo" },
  { id: "denebola", name: "Denebola", ra: 177.265, dec: 14.572, mag: 2.14, temp: 8500, constellation: "Leo" },
  { id: "algieba", name: "Algieba", ra: 146.463, dec: 19.842, mag: 2.08, temp: 4470, constellation: "Leo" },

  // TAURUS
  { id: "aldebaran", name: "Aldebaran", ra: 68.980, dec: 16.509, mag: 0.85, temp: 3910, constellation: "Taurus" },
  { id: "elnath", name: "Elnath", ra: 81.573, dec: 28.608, mag: 1.65, temp: 13600, constellation: "Taurus" },

  // GEMINI
  { id: "pollux", name: "Pollux", ra: 116.329, dec: 28.026, mag: 1.14, temp: 4666, constellation: "Gemini" },
  { id: "castor", name: "Castor", ra: 113.650, dec: 31.888, mag: 1.58, temp: 10286, constellation: "Gemini" },
  { id: "alhena", name: "Alhena", ra: 99.428, dec: 16.399, mag: 1.93, temp: 9260, constellation: "Gemini" },

  // SOUTHERN CROSS (Crux)
  { id: "acrux", name: "Acrux", ra: 186.650, dec: -63.099, mag: 0.76, temp: 28000, constellation: "Southern Cross" },
  { id: "mimosa", name: "Mimosa", ra: 191.930, dec: -59.689, mag: 1.25, temp: 27000, constellation: "Southern Cross" },
  { id: "gacrux", name: "Gacrux", ra: 187.791, dec: -57.113, mag: 1.63, temp: 3689, constellation: "Southern Cross" },
  { id: "delta_cru", name: "δ Crucis", ra: 183.786, dec: -58.749, mag: 2.79, temp: 22000, constellation: "Southern Cross" },

  // OTHER BRIGHT STARS
  { id: "sirius", name: "Sirius", ra: 101.287, dec: -16.716, mag: -1.46, temp: 9940, constellation: "Canis Major" },
  { id: "canopus", name: "Canopus", ra: 95.988, dec: -52.696, mag: -0.74, temp: 7350, constellation: "Carina" },
  { id: "arcturus", name: "Arcturus", ra: 213.915, dec: 19.182, mag: -0.05, temp: 4286, constellation: "Boötes" },
  { id: "capella", name: "Capella", ra: 79.172, dec: 45.998, mag: 0.08, temp: 4970, constellation: "Auriga" },
  { id: "procyon", name: "Procyon", ra: 114.825, dec: 5.225, mag: 0.34, temp: 6530, constellation: "Canis Minor" },
  { id: "spica", name: "Spica", ra: 201.298, dec: -11.161, mag: 0.97, temp: 25300, constellation: "Virgo" },
  { id: "fomalhaut", name: "Fomalhaut", ra: 344.413, dec: -29.622, mag: 1.16, temp: 8590, constellation: "Piscis Austrinus" },
  { id: "achernar", name: "Achernar", ra: 24.429, dec: -57.237, mag: 0.46, temp: 14500, constellation: "Eridanus" },
  { id: "hamal", name: "Hamal", ra: 31.793, dec: 23.462, mag: 2.00, temp: 4480, constellation: "Aries" },
  { id: "alphard", name: "Alphard", ra: 141.897, dec: -8.659, mag: 2.00, temp: 4120, constellation: "Hydra" },
];

// ============================================
// CONSTELLATION CONNECTION LINES
// ============================================
const constellationLines = {
  "Orion": [
    ["betelgeuse", "bellatrix"],
    ["bellatrix", "mintaka"],
    ["mintaka", "alnilam"],
    ["alnilam", "alnitak"],
    ["alnitak", "saiph"],
    ["saiph", "rigel"],
    ["rigel", "mintaka"],
    ["betelgeuse", "alnilam"],
  ],
  "Big Dipper": [
    ["dubhe", "merak"],
    ["merak", "phecda"],
    ["phecda", "megrez"],
    ["megrez", "dubhe"],
    ["megrez", "alioth"],
    ["alioth", "mizar"],
    ["mizar", "alkaid"],
  ],
  "Cassiopeia": [
    ["caph", "schedar"],
    ["schedar", "gamma_cas"],
    ["gamma_cas", "ruchbah"],
    ["ruchbah", "segin"],
  ],
  "Cygnus": [
    ["deneb", "sadr"],
    ["sadr", "gienah_cyg"],
    ["gienah_cyg", "albireo"],
    ["sadr", "albireo"],
  ],
  "Lyra": [
    ["vega", "sheliak"],
    ["sheliak", "sulafat"],
    ["sulafat", "vega"],
  ],
  "Aquila": [
    ["tarazed", "altair"],
    ["altair", "alshain"],
  ],
  "Scorpius": [
    ["dschubba", "antares"],
    ["antares", "shaula"],
    ["shaula", "sargas"],
  ],
  "Leo": [
    ["regulus", "algieba"],
    ["algieba", "denebola"],
  ],
  "Gemini": [
    ["castor", "pollux"],
    ["pollux", "alhena"],
  ],
  "Southern Cross": [
    ["acrux", "gacrux"],
    ["mimosa", "delta_cru"],
  ],
  "Little Dipper": [
    ["polaris", "kochab"],
    ["kochab", "pherkad"],
  ],
};

// Constellation centers for labels
const constellationCenters = {
  "Orion": { ra: 84, dec: -2 },
  "Big Dipper": { ra: 185, dec: 55 },
  "Cassiopeia": { ra: 15, dec: 60 },
  "Cygnus": { ra: 303, dec: 38 },
  "Lyra": { ra: 282, dec: 35 },
  "Aquila": { ra: 297, dec: 9 },
  "Scorpius": { ra: 252, dec: -30 },
  "Leo": { ra: 160, dec: 15 },
  "Gemini": { ra: 110, dec: 25 },
  "Southern Cross": { ra: 187, dec: -60 },
  "Little Dipper": { ra: 230, dec: 78 },
  "Taurus": { ra: 70, dec: 18 },
  "Canis Major": { ra: 101, dec: -20 },
  "Boötes": { ra: 214, dec: 20 },
  "Auriga": { ra: 80, dec: 44 },
  "Virgo": { ra: 200, dec: -8 },
};

// Star lookup by ID
const starById = {};
starCatalog.forEach(star => { if (star.id) starById[star.id] = star; });

// Generate background stars
for (let i = 0; i < 400; i++) {
  const ra = Math.random() * 360;
  const dec = Math.asin(2 * Math.random() - 1) * (180 / Math.PI);
  const mag = 3 + Math.random() * 2.5;
  const temp = 3000 + Math.random() * 25000;
  starCatalog.push({ name: null, ra, dec, mag, temp });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function computeGMST(julianDate) {
  const j2000 = 2451545.0;
  const jd = julianDate.dayNumber + julianDate.secondsOfDay / 86400.0;
  const T = (jd - j2000) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - j2000) +
    0.000387933 * T * T - (T * T * T) / 38710000.0;
  return ((gmst % 360) + 360) % 360;
}

function temperatureToRGB(temp) {
  if (temp > 25000) return { r: 155, g: 176, b: 255 };
  if (temp > 10000) return { r: 202, g: 215, b: 255 };
  if (temp > 7500) return { r: 255, g: 255, b: 255 };
  if (temp > 6000) return { r: 255, g: 255, b: 230 };
  if (temp > 5000) return { r: 255, g: 245, b: 200 };
  if (temp > 3500) return { r: 255, g: 200, b: 130 };
  return { r: 255, g: 160, b: 100 };
}

function magnitudeToSize(mag) {
  return Math.max(1.5, 7 - mag * 1.3);
}

// ============================================
// CANVAS OVERLAY
// ============================================

const starCanvas = document.createElement("canvas");
starCanvas.style.cssText = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;
document.getElementById("cesiumContainer").appendChild(starCanvas);

const ctx = starCanvas.getContext("2d");

function resizeCanvas() {
  starCanvas.width = viewer.canvas.width;
  starCanvas.height = viewer.canvas.height;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ============================================
// COORDINATE TRANSFORMATION & VISIBILITY
// ============================================

let showLabels = true;
let showLines = true;

// Convert RA/Dec to ECEF direction vector
function raDecToECEF(ra, dec, gmst) {
  const raRad = Cesium.Math.toRadians(ra);
  const decRad = Cesium.Math.toRadians(dec);
  const gmstRad = Cesium.Math.toRadians(gmst);

  // ICRF direction
  const icrfX = Math.cos(decRad) * Math.cos(raRad);
  const icrfY = Math.cos(decRad) * Math.sin(raRad);
  const icrfZ = Math.sin(decRad);

  // ICRF -> ECEF rotation (Earth rotation)
  const cosG = Math.cos(gmstRad);
  const sinG = Math.sin(gmstRad);

  return new Cesium.Cartesian3(
    cosG * icrfX + sinG * icrfY,
    -sinG * icrfX + cosG * icrfY,
    icrfZ
  );
}

// Check if star is visible (above horizon AND in front of camera)
function getStarScreenPosition(ra, dec, gmst) {
  const ecefDir = raDecToECEF(ra, dec, gmst);
  
  // Star world position (very far away)
  const starWorldPos = Cesium.Cartesian3.multiplyByScalar(
    ecefDir, 1e10, new Cesium.Cartesian3()
  );

  // Camera position and direction
  const cameraPos = viewer.camera.position;
  const cameraDir = viewer.camera.direction;

  // Vector from camera to star
  const toStar = Cesium.Cartesian3.subtract(
    starWorldPos, cameraPos, new Cesium.Cartesian3()
  );
  Cesium.Cartesian3.normalize(toStar, toStar);

  // Check 1: Is star in front of camera? (dot product with camera direction > 0)
  const dotDir = Cesium.Cartesian3.dot(toStar, cameraDir);
  if (dotDir < -0.2) return null; // Behind camera

  // Check 2: Is star above the local horizon?
  const horizonNormal = Cesium.Cartesian3.normalize(
    cameraPos, new Cesium.Cartesian3()
  );
  
  const dotHorizon = Cesium.Cartesian3.dot(ecefDir, horizonNormal);
  if (dotHorizon < 0) return null;

  // Get screen position
  const screenPos = Cesium.SceneTransforms.worldToWindowCoordinates(
    viewer.scene, starWorldPos
  );

  return screenPos;
}

// ============================================
// RENDER FUNCTION
// ============================================

function renderStars() {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  const time = viewer.clock.currentTime;
  const gmst = computeGMST(time);

  // Cache screen positions for constellation stars
  const screenPositions = {};

  // 1. DRAW CONSTELLATION LINES
  if (showLines) {
    ctx.strokeStyle = "rgba(70, 130, 180, 0.5)";
    ctx.lineWidth = 1.5;

    Object.entries(constellationLines).forEach(([constellation, lines]) => {
      lines.forEach(([id1, id2]) => {
        const star1 = starById[id1];
        const star2 = starById[id2];
        if (!star1 || !star2) return;

        const pos1 = screenPositions[id1] || getStarScreenPosition(star1.ra, star1.dec, gmst);
        const pos2 = screenPositions[id2] || getStarScreenPosition(star2.ra, star2.dec, gmst);

        if (pos1) screenPositions[id1] = pos1;
        if (pos2) screenPositions[id2] = pos2;

        if (!pos1 || !pos2) return;

        if (pos1.x < -100 || pos1.x > starCanvas.width + 100) return;
        if (pos2.x < -100 || pos2.x > starCanvas.width + 100) return;
        if (pos1.y < -100 || pos1.y > starCanvas.height + 100) return;
        if (pos2.y < -100 || pos2.y > starCanvas.height + 100) return;

        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      });
    });
  }

  // 2. DRAW STARS
  starCatalog.forEach((star) => {
    const screenPos = star.id 
      ? (screenPositions[star.id] || getStarScreenPosition(star.ra, star.dec, gmst))
      : getStarScreenPosition(star.ra, star.dec, gmst);

    if (!screenPos) return;

    if (screenPos.x < -20 || screenPos.x > starCanvas.width + 20) return;
    if (screenPos.y < -20 || screenPos.y > starCanvas.height + 20) return;

    const color = temperatureToRGB(star.temp);
    const size = magnitudeToSize(star.mag);

    // Glow effect
    const gradient = ctx.createRadialGradient(
      screenPos.x, screenPos.y, 0,
      screenPos.x, screenPos.y, size * 2.5
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
    gradient.addColorStop(0.2, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fill();
  });

  // 3. DRAW CONSTELLATION LABELS
  if (showLabels) {
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";

    Object.entries(constellationCenters).forEach(([name, center]) => {
      const screenPos = getStarScreenPosition(center.ra, center.dec, gmst);
      
      if (!screenPos) return;

      if (screenPos.x < 50 || screenPos.x > starCanvas.width - 50) return;
      if (screenPos.y < 30 || screenPos.y > starCanvas.height - 30) return;

      const textWidth = ctx.measureText(name).width;
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(screenPos.x - textWidth / 2 - 5, screenPos.y - 12, textWidth + 10, 22);

      ctx.fillStyle = "rgba(255, 220, 150, 0.95)";
      ctx.fillText(name, screenPos.x, screenPos.y + 5);
    });
  }
}

viewer.scene.postRender.addEventListener(renderStars);

// ============================================
// UI PANEL
// ============================================

const infoPanel = document.createElement("div");
infoPanel.style.cssText = `
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.85);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: sans-serif;
  font-size: 12px;
  max-width: 250px;
  z-index: 1000;
  border: 1px solid #444;
`;
document.body.appendChild(infoPanel);

// ============================================
// BUTTONS
// ============================================

const locations = [
  { name: "🇩🇪 Berlin", coords: [13.405, 52.52] },
  { name: "🇦🇺 Sydney", coords: [151.209, -33.868] },
  { name: "🇺🇸 New York", coords: [-74.006, 40.713] },
  { name: "🇯🇵 Tokyo", coords: [139.692, 35.689] },
  { name: "🇨🇱 Atacama", coords: [-68.0, -23.5] },
];

const buttonContainer = document.createElement("div");
buttonContainer.style.cssText = `
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 1000;
`;
document.body.appendChild(buttonContainer);

// Location title
const locTitle = document.createElement("div");
locTitle.textContent = "📍 Locations";
locTitle.style.cssText = `
  color: #aaa;
  font-size: 11px;
  font-family: sans-serif;
  margin-bottom: 2px;
`;
buttonContainer.appendChild(locTitle);

locations.forEach((loc) => {
  const btn = document.createElement("button");
  btn.textContent = loc.name;
  btn.style.cssText = `
    padding: 8px 12px;
    background: rgba(30, 80, 150, 0.9);
    color: white;
    border: 1px solid #4a90d9;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `;
  btn.onclick = () => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(loc.coords[0], loc.coords[1], 100),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(60), roll: 0 },
      duration: 2,
    });
  };
  buttonContainer.appendChild(btn);
});

// Options section
const optionsTitle = document.createElement("div");
optionsTitle.textContent = "⚙️ Display Options";
optionsTitle.style.cssText = `
  color: #aaa;
  font-size: 11px;
  font-family: sans-serif;
  margin-top: 15px;
  margin-bottom: 2px;
`;
buttonContainer.appendChild(optionsTitle);

const optionsDiv = document.createElement("div");
optionsDiv.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;
buttonContainer.appendChild(optionsDiv);

// Labels Toggle
const labelBtn = document.createElement("button");
labelBtn.textContent = "📝 Labels: ON";
labelBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(80, 120, 80, 0.9);
  color: white;
  border: 1px solid #6a6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
labelBtn.onclick = () => {
  showLabels = !showLabels;
  labelBtn.textContent = showLabels ? "📝 Labels: ON" : "📝 Labels: OFF";
  labelBtn.style.background = showLabels ? "rgba(80, 120, 80, 0.9)" : "rgba(100, 100, 100, 0.9)";
};
optionsDiv.appendChild(labelBtn);

// Lines Toggle
const lineBtn = document.createElement("button");
lineBtn.textContent = "✨ Lines: ON";
lineBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(80, 120, 80, 0.9);
  color: white;
  border: 1px solid #6a6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
lineBtn.onclick = () => {
  showLines = !showLines;
  lineBtn.textContent = showLines ? "✨ Lines: ON" : "✨ Lines: OFF";
  lineBtn.style.background = showLines ? "rgba(80, 120, 80, 0.9)" : "rgba(100, 100, 100, 0.9)";
};
optionsDiv.appendChild(lineBtn);

// OSM Buildings Toggle
const buildingsBtn = document.createElement("button");
buildingsBtn.textContent = "🏢 Buildings: OFF";
buildingsBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(100, 100, 100, 0.9);
  color: white;
  border: 1px solid #888;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
buildingsBtn.onclick = async () => {
  buildingsBtn.textContent = "🏢 Loading...";
  buildingsBtn.disabled = true;
  
  const enabled = await toggleBuildings();
  
  buildingsBtn.textContent = enabled ? "🏢 Buildings: ON" : "🏢 Buildings: OFF";
  buildingsBtn.style.background = enabled ? "rgba(80, 120, 80, 0.9)" : "rgba(100, 100, 100, 0.9)";
  buildingsBtn.style.borderColor = enabled ? "#6a6" : "#888";
  buildingsBtn.disabled = false;
};
optionsDiv.appendChild(buildingsBtn);

// Camera section
const cameraTitle = document.createElement("div");
cameraTitle.textContent = "📷 Camera";
cameraTitle.style.cssText = `
  color: #aaa;
  font-size: 11px;
  font-family: sans-serif;
  margin-top: 15px;
  margin-bottom: 2px;
`;
buttonContainer.appendChild(cameraTitle);

const cameraDiv = document.createElement("div");
cameraDiv.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;
buttonContainer.appendChild(cameraDiv);

// Look Up Button
const skyBtn = document.createElement("button");
skyBtn.textContent = "⬆️ Look Up";
skyBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(100, 50, 150, 0.9);
  color: white;
  border: 1px solid #a070d0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
skyBtn.onclick = () => {
  const pos = viewer.camera.positionCartographic;
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, 100),
    orientation: { heading: viewer.camera.heading, pitch: Cesium.Math.toRadians(85), roll: 0 },
    duration: 1,
  });
};
cameraDiv.appendChild(skyBtn);

// Look at Horizon Button
const horizonBtn = document.createElement("button");
horizonBtn.textContent = "➡️ Horizon";
horizonBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(100, 80, 50, 0.9);
  color: white;
  border: 1px solid #c9a060;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
horizonBtn.onclick = () => {
  const pos = viewer.camera.positionCartographic;
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, 100),
    orientation: { heading: viewer.camera.heading, pitch: Cesium.Math.toRadians(5), roll: 0 },
    duration: 1,
  });
};
cameraDiv.appendChild(horizonBtn);

// Street View Button
const streetBtn = document.createElement("button");
streetBtn.textContent = "🚶 Street View";
streetBtn.style.cssText = `
  padding: 8px 12px;
  background: rgba(50, 100, 100, 0.9);
  color: white;
  border: 1px solid #60a0a0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;
streetBtn.onclick = () => {
  const pos = viewer.camera.positionCartographic;
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, 2),
    orientation: { heading: viewer.camera.heading, pitch: Cesium.Math.toRadians(15), roll: 0 },
    duration: 1,
  });
};
cameraDiv.appendChild(streetBtn);

// Time buttons
const timeContainer = document.createElement("div");
timeContainer.style.cssText = `
  position: absolute;
  bottom: 60px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  z-index: 1000;
`;
document.body.appendChild(timeContainer);

const speeds = [
  { name: "⏸", mult: 0 },
  { name: "▶", mult: 1 },
  { name: "⏩ 1m/s", mult: 60 },
  { name: "⏩ 1h/s", mult: 3600 },
];

speeds.forEach((speed) => {
  const btn = document.createElement("button");
  btn.textContent = speed.name;
  btn.style.cssText = `
    padding: 6px 10px;
    background: rgba(60, 60, 60, 0.9);
    color: white;
    border: 1px solid #666;
    border-radius: 4px;
    cursor: pointer;
  `;
  btn.onclick = () => {
    viewer.clock.multiplier = speed.mult;
    viewer.clock.shouldAnimate = speed.mult !== 0;
  };
  timeContainer.appendChild(btn);
});

// Night button
const nightBtn = document.createElement("button");
nightBtn.textContent = "🌙 Night";
nightBtn.style.cssText = `
  padding: 6px 10px;
  background: rgba(80, 50, 120, 0.9);
  color: white;
  border: 1px solid #a070d0;
  border-radius: 4px;
  cursor: pointer;
`;
nightBtn.onclick = () => {
  const lon = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude);
  const now = new Date();
  now.setUTCHours(24 - Math.round(lon / 15), 0, 0, 0);
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(now);
};
timeContainer.appendChild(nightBtn);

// Day button
const dayBtn = document.createElement("button");
dayBtn.textContent = "☀️ Day";
dayBtn.style.cssText = `
  padding: 6px 10px;
  background: rgba(150, 120, 50, 0.9);
  color: white;
  border: 1px solid #d0a030;
  border-radius: 4px;
  cursor: pointer;
`;
dayBtn.onclick = () => {
  const lon = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude);
  const now = new Date();
  now.setUTCHours(12 - Math.round(lon / 15), 0, 0, 0);
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(now);
};
timeContainer.appendChild(dayBtn);

// ============================================
// INFO UPDATE
// ============================================

function updateInfo() {
  const time = viewer.clock.currentTime;
  const date = Cesium.JulianDate.toDate(time);
  const gmst = computeGMST(time);
  const cameraPos = viewer.camera.positionCartographic;
  const lat = Cesium.Math.toDegrees(cameraPos.latitude).toFixed(1);
  const lon = Cesium.Math.toDegrees(cameraPos.longitude).toFixed(1);
  const alt = cameraPos.height.toFixed(0);

  const lst = gmst / 15 + parseFloat(lon) / 15;
  const lstNorm = ((lst % 24) + 24) % 24;
  const lstH = Math.floor(lstNorm);
  const lstM = Math.floor((lstNorm - lstH) * 60);

  const localOffset = Math.round(parseFloat(lon) / 15);
  const localHour = (date.getUTCHours() + localOffset + 24) % 24;

  // Count visible stars
  let visibleStars = 0;
  starCatalog.forEach(star => {
    if (getStarScreenPosition(star.ra, star.dec, gmst)) visibleStars++;
  });

  infoPanel.innerHTML = `
    <div style="font-size: 15px; margin-bottom: 10px;">
      <strong>🌟 Star Map</strong>
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Position:</strong> ${lat}°, ${lon}°
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Altitude:</strong> ${alt} m
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Sidereal Time:</strong> ${lstH}h ${String(lstM).padStart(2, "0")}m
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Local Time:</strong> ~${localHour}:00 
      ${localHour >= 19 || localHour < 6 ? "🌙" : "☀️"}
    </div>
    <div style="color: #888; font-size: 11px; margin-top: 10px;">
      ${Object.keys(constellationCenters).length} constellations<br>
      Stars visible: ${visibleStars}<br>
      Buildings: ${buildingsEnabled ? "ON" : "OFF"}
    </div>
  `;
}

viewer.clock.onTick.addEventListener(updateInfo);

// ============================================
// START
// ============================================

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(13.405, 52.52, 100),
  orientation: { heading: 0, pitch: Cesium.Math.toRadians(65), roll: 0 },
});

const startDate = new Date();
startDate.setUTCHours(23, 0, 0, 0);
viewer.clock.currentTime = Cesium.JulianDate.fromDate(startDate);
viewer.clock.multiplier = 60;
viewer.clock.shouldAnimate = true;

console.log("🌟 Star map with OSM Buildings loaded!");