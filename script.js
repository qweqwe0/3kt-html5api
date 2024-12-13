const audioPlayer = document.getElementById('audioPlayer');

function playAudio() {
    audioPlayer.play();
}

function pauseAudio() {
    audioPlayer.pause();
}

function setAudioVolume() {
    const volume = document.getElementById('audioVolume').value;
    audioPlayer.volume = volume;
}

const videoPlayer = document.getElementById('videoPlayer');

function playVideo() {
    videoPlayer.play();
}

function pauseVideo() {
    videoPlayer.pause();
}

function setVideoVolume() {
    const volume = document.getElementById('videoVolume').value;
    videoPlayer.volume = volume;
}

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const squares = [];
const numberOfSquares = 10;
let isAnimating = true;
let animationFrameId;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Square() {
    this.x = random(0, canvas.width);
    this.y = random(0, canvas.height);
    this.size = 0;
    this.growthRate = random(0.5, 2);
    this.alpha = 1;
    this.fadeRate = 0.01;
}

for (let i = 0; i < numberOfSquares; i++) {
    squares.push(new Square());
}

function drawSquares() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    squares.forEach(square => {
        ctx.fillStyle = `rgba(0, 0, 255, ${square.alpha})`; 
        ctx.fillRect(square.x, square.y, square.size, square.size);

        square.size += square.growthRate;

       
        square.alpha -= square.fadeRate;
        if (square.alpha <= 0) {
            square.size = 0;
            square.alpha = 1; 
            square.x = random(0, canvas.width);
            square.y = random(0, canvas.height);
            square.growthRate = random(0.5, 2);
        }
    });
}

function animate() {
    drawSquares();
    animationFrameId = requestAnimationFrame(animate);
}

function toggleAnimation() {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
        document.getElementById('toggleAnimationBtn').innerText = 'Запустить анимацию';
    } else {
        animate();
        document.getElementById('toggleAnimationBtn').innerText = 'Остановить анимацию';
    }
    isAnimating = !isAnimating;
}

animate();

const imageCanvas = document.getElementById('imageCanvas');
const imageCtx = imageCanvas.getContext('2d');
const imageLoader = document.getElementById('imageLoader');

let originalImage = null;

imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            imageCtx.drawImage(img, 0, 0, img.width, img.height);
            originalImage = img;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function applySepia() {
    const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const tr = 0.393 * data[i] + 0.769 * data[i + 1] + 0.189 * data[i + 2]; 
        const tg = 0.349 * data[i] + 0.686 * data[i + 1] + 0.168 * data[i + 2]; 
        const tb = 0.272 * data[i] + 0.534 * data[i + 1] + 0.131 * data[i + 2]; 

        data[i] = tr > 255 ? 255 : tr; 
        data[i + 1] = tg > 255 ? 255 : tg; 
        data[i + 2] = tb > 255 ? 255 : tb; 
    }

    imageCtx.putImageData(imageData, 0, 0);
}

function cropImage() {
    const cropX = 50;
    const cropY = 50;
    const cropWidth = 300;
    const cropHeight = 300;

    const croppedImageData = imageCtx.getImageData(cropX, cropY, cropWidth, cropHeight);

    imageCanvas.width = cropWidth;
    imageCanvas.height = cropHeight;
    imageCtx.putImageData(croppedImageData, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = imageCanvas.toDataURL();
    link.click();
}

function resizeImage() {
    const newWidth = document.getElementById('widthInput').value;
    const newHeight = document.getElementById('heightInput').value;

    const resizedImage = document.createElement('canvas');
    resizedImage.width = newWidth;
    resizedImage.height = newHeight;
    const resizedCtx = resizedImage.getContext('2d');

    resizedCtx.drawImage(originalImage, 0, 0, newWidth, newHeight);

    imageCanvas.width = newWidth;
    imageCanvas.height = newHeight;
    imageCtx.drawImage(resizedImage, 0, 0);
}
