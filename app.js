const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const result = document.getElementById('result');

// Soft Autumn color palette (hex codes)
const softAutumnPalette = [
  '#d64336', '#616d5e', '#90b5de', '#2c404c', '#4e4340',
  '#827a80', '#7c7c78', '#444a5a', '#7f7472', '#658ae2', 
  '#f2d582', '#f6d279', '#7c7c78'
];

// Initialize the camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.error("Error accessing camera: ", err);
  }
}

// Extract the color from the video feed
function captureColor() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Get pixel data from the center of the canvas (or any part of the image)
  const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  const hexColor = rgbToHex(r, g, b);
  
  // Check if the color is in the Soft Autumn palette
  const isInPalette = softAutumnPalette.includes(hexColor.toLowerCase());

  // Update the result
  result.textContent = isInPalette ? `This color is part of the Soft Autumn palette: ${hexColor}` : `This color is NOT part of the Soft Autumn palette.`;
  result.style.color = isInPalette ? hexColor : 'black';
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Run the camera and color capture
startCamera();
setInterval(captureColor, 1000);  // Capture color every second
