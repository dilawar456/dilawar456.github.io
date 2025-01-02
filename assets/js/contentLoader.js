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
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
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
    
    // Load numbered carousel images
    CONFIG.CAROUSEL_IMAGES.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="showcase-slide">
                <img src="${imagePath}" alt="Featured Project ${index + 1}" loading="lazy">
                <div class="showcase-content">
                    <h3>Featured Project ${index + 1}</h3>
                    <p>Architectural Visualization</p>
                </div>
            </div>
        `;
        
        swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper
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
const itemsPerPage = 9;

function loadPortfolioItems(category = 'all', page = 1, append = false) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    if (!append) {
        portfolioGrid.innerHTML = '';
    }

    let allFiles = [];
    
    try {
        if (category === 'all') {
            // Load from all categories
            Object.keys(CONFIG.IMAGES).forEach(cat => {
                const files = CONFIG.IMAGES[cat] || [];
                allFiles.push(...files.map(file => ({ file, category: cat })));
            });
        } else {
            // Load from specific category
            const files = CONFIG.IMAGES[category] || [];
            allFiles = files.map(file => ({ file, category }));
        }

        // Calculate pagination
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedFiles = allFiles.slice(start, end);
        
        // Show/hide load more button
        const hasMoreItems = allFiles.length > end;
        loadMoreContainer.style.display = 'block';
        const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
        loadMoreBtn.style.display = hasMoreItems ? 'block' : 'none';

        console.log(`Loading ${category}: ${paginatedFiles.length} items (${start + 1}-${end} of ${allFiles.length})`);

        // Create and append items
        paginatedFiles.forEach((fileData, index) => {
            const { file, category: cat } = fileData;
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.category = cat;

            const mediaElement = file.endsWith('.mp4') ? 
                `<video src="${file}" autoplay loop muted playsinline></video>` :
                `<img src="${file}" alt="${cat} project" loading="lazy">`;

            item.innerHTML = `
                ${mediaElement}
                <div class="portfolio-overlay">
                    <h3>${file.split('/').pop().split('.')[0]}</h3>
                    <p>${cat.replace(/-/g, ' ').toUpperCase()}</p>
                </div>
            `;

            // Add fade in animation
            item.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            portfolioGrid.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading portfolio items:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadShowcaseProjects();
    loadPortfolioItems('all', 1);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.filter;
            currentPage = 1;
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load items
            loadPortfolioItems(currentCategory, 1, false);
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
});
