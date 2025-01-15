async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.error("Error accessing camera: ", err);
    result.textContent = "Unable to access the rear camera. Please check your browser settings.";
  }
}

function detectColor() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get color from center pixel
  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;
  
  // Convert RGB to HEX
  const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
  
  // Display detected color
  result.textContent = `Detected Color: ${hexColor}`;
  result.style.backgroundColor = hexColor;
  result.style.color = getTextColor(pixelData[0], pixelData[1], pixelData[2]);  // Ensure readable text
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function getTextColor(r, g, b) {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#FFFFFF';
}

// Add event listener for the button
document.getElementById('detectButton').addEventListener('click', detectColor);

// Start the camera when the page loads
startCamera();
