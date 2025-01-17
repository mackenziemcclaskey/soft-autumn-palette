const softAutumnPalette = [
  "#6B4E3D", "#8A7B68", "#A49381", "#D7B69E", "#E5C7B0",
  "#BBA084", "#9C7C59", "#C8A388", "#D5B596", "#DED1BE",
  "#5B7C74", "#839F8D", "#A9C2B1", "#CDDCD0", "#F0E8D6",
  "#746C75", "#8C819A", "#B1A4C3", "#D9D0E5", "#C99F69", 
  "#A9B290", "#3E6B58", "#C2B49A", "#9A8F67", "#AD8F66",
  "#A68C5D", "#7A5E3D", "#8E8F84", "#A2956F", "#9A8F78", 
  "#7D4B3B", "#4F6F50", "#6D5C44", "#BB9C72", "#A77D5C", 
  "#D0A67A", "#B3946F", "#4A3F3A", "#A78F80", "#D1B89E", 
  "#B0A385", "#4C5660", "#D0C8A1", "#A0A380", "#7C7A64", 
  "#E8D9A2", "#C8C1B5", "#B38A7E", "#C3B299", "#9B8765" 
];

const threshold = 50; // Adjust this value to control the match sensitivity

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      video.srcObject = stream;
      video.play();
    } catch (err) {
      console.error("Error accessing camera: ", err);
      result.textContent = "Unable to access the camera. Please check your browser settings.";
    }
  }
}
function addExamples() {
    const colorPaletteDiv = document.getElementById('colorPalette');
    softAutumnPalette.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.classList.add('color-box');
      colorBox.style.backgroundColor = color;
      colorBox.innerHTML = `<span>${color}</span>`;
      colorPaletteDiv.appendChild(colorBox);
    });
}

function detectColor() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;

  const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
  const isSoftAutumn = isColorInPalette(pixelData[0], pixelData[1], pixelData[2]);

  result.textContent = `Detected Color: ${hexColor} - ${isSoftAutumn ? "Soft Autumn Palette" : "Not in Soft Autumn Palette"}`;
  result.style.backgroundColor = hexColor;
  result.style.color = getTextColor(pixelData[0], pixelData[1], pixelData[2]);
}

function isColorInPalette(r, g, b) {
  return softAutumnPalette.some(color => {
    const [pr, pg, pb] = hexToRgb(color);
    const distance = Math.sqrt(Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2));
    return distance < threshold;
  });
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function getTextColor(r, g, b) {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#FFFFFF';
}

document.getElementById('detectButton').addEventListener('click', detectColor);
startCamera();
addExamples();