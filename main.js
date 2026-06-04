document.getElementById('processButton').addEventListener('click', function () {
    const imageInput = document.getElementById('imageInput');
    const watermarkText = document.getElementById('watermarkText').value;
    const outputImage = document.getElementById('outputImage');
    const downloadButton = document.getElementById('downloadButton');
    const fontSelect = document.getElementById('fontSelect');
    const positionRadio = document.getElementsByName('position');
    const processButton = document.getElementById('processButton'); 

    processButton.disabled = true;
    processButton.textContent = 'Please, wait...';
    const imageFile = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Font select
            const selectedFont = fontSelect.value;
            const fontSize = Math.min(img.width, img.height) / 10;
            ctx.font = fontSize + 'px ' + selectedFont;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textBaseline = 'middle';

            // Watermark position
            const selectedPosition = getSelectedRadioValue(positionRadio);
            const positionCoordinates = calculatePositionCoordinates(canvas, selectedPosition, fontSize);
            if (selectedPosition.includes('Left')) {
                ctx.textAlign = 'left';
            } else if (selectedPosition.includes('Right')) {
                ctx.textAlign = 'right';
            } else {
                ctx.textAlign = 'center';
            }
            ctx.fillText(watermarkText, positionCoordinates.x, positionCoordinates.y);

            outputImage.src = canvas.toDataURL('image/png');
            downloadButton.setAttribute('data-image', canvas.toDataURL('image/png'));
  
            outputContainer.style.display = 'block';
            processButton.disabled = false;
            processButton.textContent = 'Add Watermark';
        };
    };

    reader.readAsDataURL(imageFile);
});

const selectedFileName = document.getElementById('selectedFileName');
selectedFileName.textContent = 'File not selected';
imageInput.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        selectedFileName.textContent = `Selected: ${imageInput.files[0].name}`;
    } else {
      selectedFileName.textContent = 'File not selected';
    }
    updateButtonState();
});

function updateButtonState() {
    if (imageInput.files.length === 0 || watermarkText.value.trim() === "") {
        processButton.disabled = true;
    } else {
        processButton.disabled = false;
    }
}

imageInput.addEventListener('change', () => {
    updateButtonState();
});

watermarkText.addEventListener('input', () => {
    updateButtonState();
});

document.getElementById('downloadButton').addEventListener('click', function () {
    const imageData = this.getAttribute('data-image');
    if (imageData) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'watermarked_image.png';
        link.click();
    }
});

function getSelectedRadioValue(radioGroup) {
    for (let i = 0; i < radioGroup.length; i++) {
        if (radioGroup[i].checked) {
            return radioGroup[i].value;
        }
    }
    return null;
}

function calculatePositionCoordinates(canvas, position, fontSize) {
    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;

    switch (position) {
        case 'topLeft':
            return { x: fontSize * 0.6, y: fontSize };
        case 'topRight':
            return { x: canvas.width - fontSize * 0.6, y: fontSize };
        case 'bottomLeft':
            return { x: fontSize * 0.6, y: canvas.height - fontSize };
        case 'bottomRight':
            return { x: canvas.width - fontSize * 0.6, y: canvas.height - fontSize };
        case 'center':
            return { x: xCenter, y: yCenter };
        default:
            return { x: xCenter - fontSize, y: yCenter };
    }
}