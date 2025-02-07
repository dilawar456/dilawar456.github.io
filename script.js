// Add this at the top of the file
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navHeight = document.querySelector('nav').offsetHeight;
    const sectionTop = section.offsetTop - navHeight;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
}

// Add this function for image error handling
function handleImageError(img) {
    if (!img.dataset.retryCount) {
        img.dataset.retryCount = '0';
    }
    
    const retryCount = parseInt(img.dataset.retryCount);
    if (retryCount < 3) { // Try up to 3 times
        img.dataset.retryCount = (retryCount + 1).toString();
        setTimeout(() => {
            img.src = img.src; // Retry loading
        }, 1000 * (retryCount + 1)); // Increasing delay for each retry
    } else {
        img.onerror = null; // Prevent infinite loop
        img.src = 'assets/content/placeholder.jpg';
        console.warn(`Failed to load image after 3 retries: ${img.src}`);
    }
}

// Add at the top of the file
async function preloadImages() {
    const criticalImages = [
        'assets/content/Dilawar CV.png',
        'assets/content/carousel/1.jpg',
        'assets/content/carousel/2.jpg',
        'assets/content/carousel/3.jpg'
    ];

    const loadImage = (url) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            console.warn(`Failed to preload image: ${url}`);
            resolve(false);
        };
        img.src = url;
    });

    try {
        await Promise.all(criticalImages.map(loadImage));
    } catch (error) {
        console.error('Image preloading error:', error);
    }
}

// Update YouTube embed initialization
function initYouTubeEmbeds() {
    const ytEmbeds = document.querySelectorAll('iframe[src*="youtube"]');
    ytEmbeds.forEach(embed => {
        const videoId = embed.src.split('/').pop().split('?')[0];
        const params = new URLSearchParams({
            enablejsapi: '1',
            rel: '0',
            modestbranding: '1',
            playsinline: '1',
            origin: window.location.origin,
            autoplay: '0',
            controls: '1',
            showinfo: '0',
            iv_load_policy: '3'
        });
        
        embed.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
        embed.setAttribute('loading', 'lazy');
        embed.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    });
}

// Navigation background change on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.style.background = window.scrollY > 50 ? 
        'rgba(26, 26, 26, 0.95)' : 
        'rgba(26, 26, 26, 0.7)';
});

// Animate skill bars on scroll
const skillLevels = document.querySelectorAll('.skill-level');
const animateSkills = () => {
    skillLevels.forEach(skill => {
        const skillTop = skill.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (skillTop < windowHeight * 0.8) {
            const width = skill.parentElement.parentElement.querySelector('.skill-percentage').textContent;
            skill.style.width = width;
        }
    });
};

// Portfolio items animation
const portfolioItems = document.querySelectorAll('.portfolio-item');
const animatePortfolio = () => {
    portfolioItems.forEach((item, index) => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (itemTop < windowHeight * 0.8) {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};

// Initialize portfolio items
portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const value = stat.textContent;
        const target = parseInt(value);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.floor(current) + '+';
        }, 30);
    });
};

// Replace the initSwiper function with this one
function initSwiper() {
    const showcaseSlider = document.querySelector('.showcase-slider');
    if (!showcaseSlider) return;

    const swiperWrapper = showcaseSlider.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = '';

    // Define content in order - first videos, then images
    const sliderContent = [
        // Videos first
        { type: 'video', id: 'Avgp4riXSnU' },
        { type: 'video', id: '2vrey6JRZtA' },
        { type: 'video', id: 'iw792OuOUs4' },
        // Then images
        { type: 'image', path: 'assets/content/carousel/1.jpg' },
        { type: 'image', path: 'assets/content/carousel/2.jpg' },
        { type: 'image', path: 'assets/content/carousel/3.jpg' },
        { type: 'image', path: 'assets/content/carousel/4.jpg' },
        { type: 'image', path: 'assets/content/carousel/5.jpg' },
        { type: 'image', path: 'assets/content/carousel/6.jpg' },
        { type: 'image', path: 'assets/content/carousel/7.jpg' }
    ];

    // Create slides
    sliderContent.forEach((content, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        if (content.type === 'video') {
            slide.innerHTML = `
                <div class="video-container">
                    <iframe
                        src="https://www.youtube-nocookie.com/embed/${content.id}?rel=0&showinfo=0&modestbranding=1"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        } else {
            slide.innerHTML = `
                <img src="${content.path}" 
                     alt="Project ${index + 1}"
                     onerror="this.src='assets/content/placeholder.jpg'">
            `;
        }
        
        swiperWrapper.appendChild(slide);
    });

    return new Swiper('.showcase-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: false,
        autoplay: false,
        effect: 'fade',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}">${index + 1}</span>`;
            },
        }
    });
}

// Update Swiper initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First preload critical images
        await preloadImages();
        
        // Initialize YouTube embeds
        initYouTubeEmbeds();
        
        // Load portfolio items first
        await loadPortfolioItems('all', true);
        
        // Then initialize Swiper
        const swiper = await initSwiper();

        // Initialize popup functionality
        initializePopup();
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Add this function to handle popup initialization
function initializePopup() {
    const popup = document.querySelector('.job-search-popup');
    const backdrop = document.querySelector('.backdrop-overlay');
    const closePopup = document.querySelector('.close-popup');

    if (popup && backdrop && closePopup) {
        setTimeout(() => {
            popup.classList.add('show');
            backdrop.classList.add('show');
        }, 15000);

        const hidePopup = () => {
            popup.classList.remove('show');
            backdrop.classList.remove('show');
        };

        closePopup.addEventListener('click', hidePopup);
        backdrop.addEventListener('click', hidePopup);
    }
}

// Portfolio configuration
const portfolioConfig = {
    itemsPerLoad: 12,  // Changed from 6 to 9
    currentItems: 0,
    filters: {
        'all': { maxItems: 12 },        // Set to 12 for initial category load
        'exterior': { maxItems: 100 },
        'interior': { maxItems: 100 },
        'commercial': { maxItems: 100 },
        '3d-floor-plans': { maxItems: 100 },
        '2d-floor-plans': { maxItems: 100 },
        'autocad': { maxItems: 100 },
        'society': { maxItems: 100 },
        'landscapes': { maxItems: 100 },
        'animations': { maxItems: 50 }    // Keep YouTube videos at 50
    },
    currentFilter: 'all',
    loadedImages: new Set()
};

// Add this constant at the top of the file
const YOUTUBE_PLAYLIST_ID = 'PLafdAuCnIG3qEOHRX50sRGNH71Eb19NHr';
const YOUTUBE_API_KEY = 'AIzaSyDHgAj5tgrFLXmSDo6rjm9OnkcU-X2MDhg';

// Portfolio filtering and loading functionality
document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Directory mapping for different categories
    const directoryMap = {
        'exterior': 'exterior',
        'interior': 'interior',
        'commercial': 'commercial',
        '3d-floor-plans': '3dplans',    // Updated folder name
        '2d-floor-plans': '2dplans',    // Updated folder name
        'society': 'society renders',
        'landscapes': 'landscapes',
        'animations': 'animations'
    };

    // Initialize portfolio items
    loadPortfolioItems('all', true);

    // Filter button click handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Reset configuration for new filter
            portfolioConfig.currentFilter = filter;
            portfolioConfig.currentItems = 0;
            portfolioConfig.loadedImages.clear();
            
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Clear and reload items
            portfolioGrid.innerHTML = '';
            loadPortfolioItems(filter, true);
        });
    });

    // Load more button handler
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadPortfolioItems(portfolioConfig.currentFilter, false);
        });
    }

    function getImagePath(filter, index) {
        if (filter === 'all') {
            const categories = Object.keys(directoryMap).filter(cat => cat !== 'animations' && cat !== 'autocad');
            const category = categories[index % categories.length];
            const categoryIndex = Math.floor(index / categories.length) + 1;
            const dirName = directoryMap[category];
            
            // Special handling for 2D and 3D plans
            if (dirName === '3dplans') {
                return `assets/content/${dirName}/3d-plan${categoryIndex}.jpg`;
            } else if (dirName === '2dplans') {
                return `assets/content/${dirName}/2d-plan${categoryIndex}.jpg`;
            }
            return `assets/content/${dirName}/${categoryIndex}.jpg`;
        } else {
            const dirName = directoryMap[filter];
            
            // Special handling for 2D and 3D plans
            if (filter === '3d-floor-plans') {
                return `assets/content/3dplans/3d-plan${index}.jpg`;
            } else if (filter === '2d-floor-plans') {
                return `assets/content/2dplans/2d-plan${index}.jpg`;
            }
            return `assets/content/${dirName}/${index}.jpg`;
        }
    }

    // Add this function to fetch YouTube playlist videos
    async function fetchYouTubePlaylist() {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}&order=date`);
            if (!response.ok) {
                throw new Error('Failed to fetch playlist');
            }
            const data = await response.json();
            console.log('Fetched YouTube data:', data); // Debug log

            return data.items
                .filter(item => 
                    item.snippet && 
                    item.snippet.resourceId && 
                    item.snippet.title !== 'Private video' && 
                    item.snippet.title !== 'Deleted video'
                )
                .map(item => ({
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title
                }));
        } catch (error) {
            console.error('Error fetching YouTube playlist:', error);
            return [];
        }
    }

    // Update loadPortfolioItems function
    async function loadPortfolioItems(filter, isInitial) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (isInitial) {
            portfolioGrid.innerHTML = '';
            portfolioConfig.currentItems = 0;
            portfolioConfig.loadedImages.clear();
        }

        // Special handling for 'all' filter
        if (filter === 'all') {
            const allCategories = Object.keys(directoryMap).filter(cat => 
                cat !== 'animations' && cat !== 'autocad'
            );
            
            // Get first 12 images from each category
            for (const category of allCategories) {
                const maxItemsPerCategory = 12;
                for (let i = 1; i <= maxItemsPerCategory; i++) {
                    const imagePath = `assets/content/${directoryMap[category]}/${i}.jpg`;
                    if (await checkImageExists(imagePath)) {
                        portfolioConfig.loadedImages.add(imagePath);
                    }
                }
            }

            // Randomly select and display images from the collected set
            const randomImages = Array.from(portfolioConfig.loadedImages)
                .sort(() => Math.random() - 0.5)
                .slice(0, portfolioConfig.itemsPerLoad);

            randomImages.forEach(imagePath => {
                const category = Object.keys(directoryMap).find(cat => 
                    imagePath.includes(directoryMap[cat])
                );
                const item = createPortfolioItem(category, imagePath, 
                    parseInt(imagePath.match(/\d+/)[0])
                );
                portfolioGrid.appendChild(item);
            });

            // Always show load more for 'all' filter since there are many categories
            loadMoreBtn.style.display = 'block';
        } else {
            // Existing category-specific loading logic
            if (filter === 'animations') {
                try {
                    const videos = await fetchYouTubePlaylist();
                    if (videos.length === 0) return;
    
                    const startIndex = portfolioConfig.currentItems;
                    const endIndex = Math.min(startIndex + 9, videos.length);
    
                    for (let i = startIndex; i < endIndex; i++) {
                        const video = videos[i];
                        const item = createPortfolioItem('animations', video, i + 1);
                        portfolioGrid.appendChild(item);
                    }
    
                    portfolioConfig.currentItems = endIndex;
                    loadMoreBtn.style.display = endIndex < videos.length ? 'block' : 'none';
                } catch (error) {
                    console.error('Error loading videos:', error);
                }
            } else {
                const startIndex = portfolioConfig.currentItems;
                const batchSize = 9;
                let imagesLoaded = 0;
    
                // Try to load exactly 12 images
                for (let i = startIndex + 1; i <= startIndex + batchSize; i++) {
                    let imagePath;
                    if (filter === 'all') {
                        // ...existing all filter code...
                        const categories = Object.keys(directoryMap).filter(cat => cat !== 'animations');
                        const category = categories[(i - 1) % categories.length];
                        const dirName = directoryMap[category];
                        imagePath = `assets/content/${dirName}/${i}.jpg`;
                    } else {
                        imagePath = `assets/content/${directoryMap[filter]}/${i}.jpg`;
                    }
    
                    try {
                        const exists = await checkImageExists(imagePath);
                        if (exists) {
                            const item = createPortfolioItem(filter, imagePath, i);
                            portfolioGrid.appendChild(item);
                            imagesLoaded++;
                        }
                    } catch (error) {
                        continue;
                    }
                }
    
                // Update state and check for more images
                if (imagesLoaded > 0) {
                    portfolioConfig.currentItems += batchSize;
                    
                    // Check if next image exists
                    const nextImagePath = filter === 'all' 
                        ? getImagePath(filter, portfolioConfig.currentItems + 1)
                        : `assets/content/${directoryMap[filter]}/${portfolioConfig.currentItems + 1}.jpg`;
    
                    const hasMoreImages = await checkImageExists(nextImagePath);
                    
                    // Only show load more if we loaded a full batch and more images exist
                    loadMoreBtn.style.display = (imagesLoaded === batchSize && hasMoreImages) ? 'block' : 'none';
                }
            }
        }
    }

    // Add helper function to check if image exists
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Update the createPortfolioItem function
    function createPortfolioItem(filter, content, index) {
        if (filter === '2d-floor-plans') {
            const item = document.createElement('div');
            item.className = 'portfolio-item pdf-item';
            
            // Create PDF preview container
            const pdfContainer = document.createElement('div');
            pdfContainer.className = 'pdf-preview';
            
            // Create PDF icon and title
            pdfContainer.innerHTML = `
                <div class="pdf-icon">
                    <i class="fas fa-file-pdf"></i>
                    <span>2D Plan ${index}</span>
                </div>
            `;
            
            item.appendChild(pdfContainer);
            
            // Create overlay with title
            const overlay = document.createElement('div');
            overlay.className = 'portfolio-overlay';
            overlay.innerHTML = `<h3>2D Floor Plan ${index}</h3>`;
            item.appendChild(overlay);
            
            // Add click handler for PDF modal
            item.addEventListener('click', () => {
                const pdfPath = `assets/content/2dplans/plan${index}.pdf`;
                const modal = document.createElement('div');
                modal.className = 'pdf-modal';
                modal.innerHTML = `
                    <div class="pdf-modal-content">
                        <button class="close-modal">&times;</button>
                        <object 
                            data="${pdfPath}" 
                            type="application/pdf" 
                            width="100%" 
                            height="100%">
                            <p>Unable to display PDF. <a href="${pdfPath}" target="_blank">Download Instead</a></p>
                        </object>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Add close handlers
                const closeBtn = modal.querySelector('.close-modal');
                closeBtn.onclick = () => modal.remove();
                modal.onclick = (e) => {
                    if (e.target === modal) modal.remove();
                };
            });
            
            return item;
        } else if (filter === 'animations' || (filter === 'all' && content.id)) {
            const item = document.createElement('div');
            item.className = 'portfolio-item video-item';
            
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            videoContainer.style.backgroundColor = '#000';
            
            const iframe = document.createElement('iframe');
            const params = new URLSearchParams({
                enablejsapi: '1',
                rel: '0',
                modestbranding: '1',
                playsinline: '1',
                origin: window.location.origin,
                autoplay: '0',
                controls: '1',
                showinfo: '0'
            });
            
            iframe.src = `https://www.youtube-nocookie.com/embed/${content.id}?${params.toString()}`;
            iframe.title = content.title || `Video ${index}`;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.setAttribute('loading', 'lazy');
            
            videoContainer.appendChild(iframe);
            item.appendChild(videoContainer);
            
            return item;
        } else {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.setAttribute('data-category', filter);
            
            const img = document.createElement('img');
            img.src = content;
            img.alt = `${filter} project ${index}`;
            img.loading = 'lazy'; // Add lazy loading
            img.onerror = () => handleImageError(img);
            item.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'portfolio-overlay';
            
            const title = document.createElement('h3');
            title.textContent = `${filter.charAt(0).toUpperCase() + filter.slice(1)} Project ${index}`;
            overlay.appendChild(title);
            
            item.appendChild(overlay);

            return item;
        }
    }

    // Add special handling for AutoCAD and 2D Plans buttons
    const specialButtons = {
        'autocad': 'https://drive.google.com/drive/folders/1_WjCSCJTDQKjU3Krv8dObiDuxv77tR0-?usp=sharing',
        'animations': 'PLafdAuCnIG3qEOHRX50sRGNH71Eb19NHr' // YouTube playlist ID
    };

    Object.entries(specialButtons).forEach(([filter, value]) => {
        const btn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (btn) {
            if (filter === 'autocad') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(value, '_blank');
                });
            } else if (filter === 'animations') {
                btn.addEventListener('click', async () => {
                    const portfolioGrid = document.querySelector('.portfolio-grid');
                    portfolioGrid.innerHTML = ''; // Clear existing content
                    
                    try {
                        const videos = await fetchYouTubePlaylist(value);
                        videos.forEach((video, index) => {
                            const videoItem = createVideoItem(video, index + 1);
                            portfolioGrid.appendChild(videoItem);
                        });
                    } catch (error) {
                        console.error('Error loading videos:', error);
                    }
                });
            }
        }
    });
});

// Run animations on scroll
window.addEventListener('scroll', () => {
    animateSkills();
    animatePortfolio();
});

// Run stats animation on page load
window.addEventListener('load', () => {
    animateStats();
});

// Replace just the animations related functions and event listeners
function handleAnimationsClick() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.innerHTML = '';
    
    // Define the exact list of videos
    const videos = [
        { id: 'Avgp4riXSnU', title: 'Exterior Animation' },
        { id: '2vrey6JRZtA', title: 'Interior Animation' },
        { id: 'iw792OuOUs4', title: 'Commercial Animation' },
        // Add more video IDs here if needed
    ];

    videos.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'portfolio-item video-item';
        
        videoContainer.innerHTML = `
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${video.id}?rel=0&showinfo=0&modestbranding=1&controls=1"
                    title="${video.title}"
                    frameborder="0"
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                </iframe>
            </div>
        `;
        
        portfolioGrid.appendChild(videoContainer);
    });
}

// Update the animations button event listener
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    
    const animationsBtn = document.querySelector('.filter-btn[data-filter="animations"]');
    if (animationsBtn) {
        animationsBtn.addEventListener('click', () => {
            // Remove active class from other buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to animations button
            animationsBtn.classList.add('active');
            // Handle animations click
            handleAnimationsClick();
        });
    }
    
    // ...existing code...
});

// Update createPortfolioItem function for animations
function createVideoItem(video, index) {
    const item = document.createElement('div');
    item.className = 'portfolio-item video-item';
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.style.backgroundColor = '#000';
    
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&showinfo=0&modestbranding=1`;
    iframe.title = video.title || `Animation ${index}`;
    iframe.allowFullscreen = true;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    videoContainer.appendChild(iframe);
    item.appendChild(videoContainer);
    
    return item;
}

// Remove old animations related code
// (Remove any other animations related functions or event listeners)

// ...rest of existing code...
