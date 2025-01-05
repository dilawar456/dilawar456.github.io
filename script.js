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

// Update Swiper initialization
document.addEventListener('DOMContentLoaded', () => {
    const showcaseSlider = document.querySelector('.showcase-slider');
    if (showcaseSlider) {
        const swiper = new Swiper('.showcase-slider', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: false,
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
});

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
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${content.id}?autoplay=1&controls=0&mute=1&loop=1&playlist=${content.id}&modestbranding=1&playsinline=1&rel=0`;
            iframe.title = content.title;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            videoContainer.appendChild(iframe);
            item.appendChild(videoContainer);
            
            const overlay = document.createElement('div');
            overlay.className = 'portfolio-overlay';
            
            const title = document.createElement('h3');
            title.textContent = content.title;
            overlay.appendChild(title);
            
            item.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${content.id}`, '_blank');
            });
            
            item.appendChild(overlay);
            return item;
        } else {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.setAttribute('data-category', filter);
            
            const img = document.createElement('img');
            img.src = content;
            img.alt = `${filter} project ${index}`;
            img.loading = 'lazy';
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
        'autocad': 'https://drive.google.com/drive/folders/1_WjCSCJTDQKjU3Krv8dObiDuxv77tR0-?usp=sharing'
    };

    Object.entries(specialButtons).forEach(([filter, url]) => {
        const btn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (btn) {
            btn.removeAttribute('data-filter');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(url, '_blank');
            });
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
