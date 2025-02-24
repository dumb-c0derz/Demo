const baseImageUrls = [
    "https://i.imx.to/i/2025/02/10/5x0999.jpg",
    "https://i.imx.to/i/2025/02/22/5y8s3x.jpg"
];

let generatedImages = []; // Store all generated image URLs

// Add updated CSS styles
const style = document.createElement('style');
style.textContent = `
    .image-container {
        position: relative;
        cursor: pointer;
    }
    
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .popup-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .popup-image {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 8px;
    }

    .controls {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 15px;
    }

    .control-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
        transition: opacity 0.3s;
    }

    .control-btn:hover {
        opacity: 0.8;
    }

    .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40px;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
        padding: 15px;
    }

    .prev-btn {
        left: 20px;
    }

    .next-btn {
        right: 20px;
    }
`;
document.head.appendChild(style);

function generateRandomChars() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateImageUrls(baseUrl) {
    const parts = baseUrl.split('.jpg')[0];
    const newBase = parts.slice(0, -3);
    const randomChars = generateRandomChars();

    const iVersion = `${newBase}${randomChars}.jpg`;
    const tVersion = iVersion.replace('/i/', '/t/');

    return { iVersion, tVersion };
}

function createPopup(imageUrl, index) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const content = document.createElement('div');
    content.className = 'popup-content';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'popup-image';

    // Controls container
    const controls = document.createElement('div');
    controls.className = 'controls';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'control-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'control-btn';
    downloadBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
    `;
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Carousel buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev-btn';
    prevBtn.innerHTML = '&lt;';
    prevBtn.onclick = () => navigateCarousel(-1);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next-btn';
    nextBtn.innerHTML = '&gt;';
    nextBtn.onclick = () => navigateCarousel(1);

    let currentIndex = index;

    function navigateCarousel(direction) {
        currentIndex = (currentIndex + direction + generatedImages.length) % generatedImages.length;
        img.src = generatedImages[currentIndex].iVersion;
    }

    // Close on outside click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Assemble elements
    controls.appendChild(downloadBtn);
    controls.appendChild(closeBtn);
    content.appendChild(controls);
    content.appendChild(prevBtn);
    content.appendChild(nextBtn);
    content.appendChild(img);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}

function generateImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    generatedImages = [];

    for (let i = 0; i < 100; i++) {
        const baseUrl = baseImageUrls[Math.floor(Math.random() * baseImageUrls.length)];
        const { iVersion, tVersion } = generateImageUrls(baseUrl);
        generatedImages.push({ iVersion, tVersion });

        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = tVersion;
        img.alt = `Generated image ${i + 1}`;

        let hoverTimeout;

        container.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                img.src = iVersion;
            }, 1000);
        });

        container.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            img.src = tVersion;
        });

        container.addEventListener('click', (e) => {
            e.preventDefault();
            createPopup(iVersion, i);
        });

        container.appendChild(img);
        gallery.appendChild(container);
    }
      }
