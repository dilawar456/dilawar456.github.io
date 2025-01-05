// Debug function to check paths and files
function debugFileAccess(directory) {
    console.log('Trying to access directory:', directory);
    try {
        const img = new Image();
        img.src = directory + '/test.jpg';
        img.onerror = () => console.log('Failed to load from:', directory);
        img.onload = () => console.log('Successfully loaded from:', directory);
    } catch (error) {
        console.error('Directory access error:', error);
    }
}

// Function to get all files from a directory
function getFilesFromDirectory(directory) {
    const category = directory.split('/').pop().toLowerCase().replace(/[- ]/g, '');
    
    // Use predefined paths from CONFIG
    if (CONFIG.IMAGES && CONFIG.IMAGES[category]) {
        return CONFIG.IMAGES[category];
    }

    // Fallback paths with correct directory structure
    const sampleFiles = {
        'exterior': [
            'assets/content/exterior/exterior1.jpg',
            'assets/content/exterior/exterior2.jpg',
            'assets/content/exterior/exterior3.jpg'
        ],
        'interior': [
            'assets/content/interior/interior1.jpg',
            'assets/content/interior/interior2.jpg'
        ],
        'commercial': [
            'assets/content/commercial/commercial1.jpg',
            'assets/content/commercial/commercial2.jpg'
        ],
        // Add other categories with correct paths
    };

    return sampleFiles[category] || [];
}

// Update folder map to match config exactly
const categoryFolderMap = {
    'exterior': 'exterior',
    'interior': 'interior',
    'commercial': 'commercial',
    '3d-floor-plans': '3d-floor-plans',
    '2d-floor-plans': '2d-floor-plans',
    'autocad': 'autocad',
    'society': 'society',
    'landscapes': 'landscapes',
    'animations': 'animations'
};

// Initialize Swiper for project showcase
let showcaseSwiper;
function initShowcaseSlider() {
    showcaseSwiper = new Swiper('.showcase-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: false, // Disabled autoplay
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// Load showcase projects
function loadShowcaseProjects() {
    const swiperWrapper = document.querySelector('.showcase-slider .swiper-wrapper');
    swiperWrapper.innerHTML = '';
    
    // First 3 YouTube videos with correct IDs
    const youtubeVideos = [
        '2vrey6JRZtA',  // First video
        'iw792OuOUs4',  // Second video
        'Avgp4riXSnU'   // Third video
    ];

    // Add YouTube videos first
    youtubeVideos.forEach((videoId, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="showcase-slide">
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&autoplay=0"
                        title="YouTube Video ${index + 1}"
                        frameborder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        swiperWrapper.appendChild(slide);
    });

    // Then add the images (only 7 images now)
    for(let i = 1; i <= 7; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="showcase-slide">
                <img src="assets/content/carousel/${i}.jpg" alt="Featured Project ${i + 3}" loading="lazy">
                <div class="showcase-content">
                    <h3>Featured Project ${i + 3}</h3>
                    <p>Architectural Visualization</p>
                </div>
            </div>
        `;
        
        swiperWrapper.appendChild(slide);
    }

    // Initialize Swiper with autoplay disabled
    setTimeout(() => {
        if (showcaseSwiper) {
            showcaseSwiper.destroy();
        }
        initShowcaseSlider();
    }, 100);
}

// Portfolio filtering and loading
let currentCategory = 'all';
let currentPage = 1;
const itemsPerPage = 12;
let allFilesCache = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomImagesFromCategories() {
    let allImages = [];
    // Get only first 12 images from each category when 'all' is selected
    Object.keys(CONFIG.IMAGES).forEach(cat => {
        const files = CONFIG.IMAGES[cat] || [];
        // Take only first 12 images from each category
        const categoryImages = files.slice(0, 12).map(file => ({ file, category: cat }));
        allImages = allImages.concat(categoryImages);
    });
    return shuffleArray(allImages);
}

function createVideoElement(src) {
    return `
        <div class="video-wrapper">
            <video 
                src="${src}"
                class="portfolio-video"
                autoplay 
                loop 
                muted 
                playsinline
                controlsList="nodownload"
                onloadedmetadata="this.dataset.quality = this.videoHeight"
                oncanplay="this.play()"
                onerror="this.onerror=null; this.load();"
            >
                <source src="${src}" type="video/mp4">
            </video>
        </div>
    `;
}

function loadPortfolioItems(category = 'all', page = 1, append = false) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const loadMoreContainer = document.querySelector('.load-more-container');
    const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
    
    if (!append) {
        portfolioGrid.innerHTML = '';
        if (category === 'all') {
            allFilesCache = getRandomImagesFromCategories();
        } else {
            // For specific categories, get all images
            allFilesCache = CONFIG.IMAGES[category].map(file => ({ file, category }));
        }
    }

    try {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedFiles = allFilesCache.slice(start, end);
        
        // Show/hide load more button based on remaining items
        const hasMoreItems = end < allFilesCache.length;
        loadMoreContainer.style.display = 'block';
        loadMoreBtn.style.display = hasMoreItems ? 'block' : 'none';

        paginatedFiles.forEach((fileData, index) => {
            const { file, category: cat } = fileData;
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.category = cat;

            const isVideo = file.endsWith('.mp4');
            item.classList.toggle('video-item', isVideo);

            const mediaElement = isVideo ? 
                createVideoElement(file) :
                `<img src="${file}" alt="${cat} project" loading="lazy">`;

            item.innerHTML = `
                ${mediaElement}
                <div class="portfolio-overlay">
                    <h3>${file.split('/').pop().split('.')[0]}</h3>
                    <p>${cat.replace(/-/g, ' ').toUpperCase()}</p>
                </div>
            `;

            item.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            portfolioGrid.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading portfolio items:', error);
    }
}

// Add video quality management
function manageVideoQuality() {
    const videos = document.querySelectorAll('.portfolio-video');
    videos.forEach(video => {
        // Check connection speed
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.downlink < 1) { // Slow connection
                video.setAttribute('height', '360');
            } else if (connection.downlink < 5) { // Medium connection
                video.setAttribute('height', '480');
            } else { // Fast connection
                video.setAttribute('height', '720');
            }
        }
        
        // Handle video loading
        video.addEventListener('loadedmetadata', function() {
            if (this.videoHeight > 720) {
                this.style.maxHeight = '720px';
            }
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadShowcaseProjects();
    loadPortfolioItems('all', 1);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            currentCategory = category;
            currentPage = 1;
            allFilesCache = []; // Reset cache when changing categories
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load items
            loadPortfolioItems(category, 1, false);
        });
    });
    
    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadPortfolioItems(currentCategory, currentPage, true);
        });
    }

    // Add IntersectionObserver for videos
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (video) {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all video items
    document.querySelectorAll('.video-item').forEach(item => {
        videoObserver.observe(item);
    });
});
