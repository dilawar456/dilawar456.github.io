let portfolioData = [];

async function loadAllPortfolioData() {
    const localData = [];
    console.log('Starting to load portfolio items...');
    
    // Define base path for images
    const basePath = 'images/portfolio';
    
    // Define all categories and their file types
    const categories = {
        'exterior': { ext: 'jpg', max: 200, path: `${basePath}/exterior` },
        'interior': { ext: 'jpg', max: 200, path: `${basePath}/interior` },
        'commercial': { ext: 'jpg', max: 200, path: `${basePath}/commercial` },
        'landscape': { ext: 'jpg', max: 200, path: `${basePath}/landscape` },
        '3d-plans': { ext: 'jpg', max: 200, path: `${basePath}/3d-plans` },
        'floor-plans': { ext: 'jpg', max: 200, path: `${basePath}/floor-plans` },
        'drawings': { ext: 'pdf', max: 200, path: `${basePath}/drawings` },
        'animations': { ext: 'mp4', max: 200, path: `${basePath}/animations` }
    };

    // Try loading from numbered files first (1) through (200)
    for (const [category, config] of Object.entries(categories)) {
        console.log(`Loading ${category} images...`);
        
        // Try both naming formats
        const namingFormats = [
            i => `${config.path}/${category}-${i}.${config.ext}`,
            i => `${config.path}/${category} (${i}).${config.ext}`
        ];

        for (let i = 1; i <= config.max; i++) {
            for (const getFileName of namingFormats) {
                const fileName = getFileName(i);
                try {
                    const response = await fetch(fileName, { method: 'HEAD' });
                    if (response.ok) {
                        localData.push({
                            type: config.ext === 'mp4' ? 'video' : 'image',
                            category: category,
                            url: fileName,
                            title: `${category} ${i}`,
                            thumbnail: config.ext === 'mp4' ? 
                                `${config.path}/${category}-${i}-thumb.jpg` : fileName
                        });
                        console.log(`Found: ${fileName}`);
                        break; // Found file in this format, move to next number
                    }
                } catch (e) {
                    continue; // Try next format or number
                }
            }
        }
    }

    // Also try loading from links.txt if available
    try {
        const response = await fetch('data/links.txt');
        if (response.ok) {
            const text = await response.text();
            const links = text.split('\n')
                .filter(link => link.trim())
                .map(link => link.trim());
            
            for (const link of links) {
                const type = link.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
                localData.push({
                    type,
                    category: 'all',
                    url: link,
                    title: link.split('/').pop().split('.')[0],
                    thumbnail: type === 'video' ? link.replace('.mp4', '-thumb.jpg') : link
                });
            }
        }
    } catch (e) {
        console.warn('No links.txt found, continuing with folder structure');
    }

    console.log(`Total items found: ${localData.length}`);
    return localData;
}

function updateFilterButtons(categories) {
    const filterContainer = document.querySelector('.filters');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        ${categories.map(category => `
            <button class="filter-btn" data-filter="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `).join('')}
    `;
    
    // Reattach event listeners
    attachFilterListeners();
}

async function init() {
    portfolioData = await loadAllPortfolioData();
    displayPortfolioItems(portfolioData);
}

const maxImages = 150; // Increased limit

const portfolioGrid = document.querySelector('.portfolio-grid');

async function detectImageRatio(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            if (ratio > 1.2) resolve('wide');
            else if (ratio < 0.8) resolve('tall');
            else resolve('square');
        };
        img.onerror = () => resolve('wide'); // default fallback
        img.src = url;
    });
}

// Improved image loading function
async function displayPortfolioItems(items) {
    if (!portfolioGrid || !items || items.length === 0) {
        console.warn('No items to display');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p>No items found. Please check image paths.</p>';
        }
        return;
    }

    console.log(`Preparing to display ${items.length} items`);
    
    // Sort items by category and then by title
    const sortedItems = items.sort((a, b) => {
        if (a.category === b.category) {
            return a.title.localeCompare(b.title, undefined, {numeric: true});
        }
        return a.category.localeCompare(b.category);
    });

    portfolioGrid.innerHTML = sortedItems.map(item => {
        return `
            <div class="portfolio-item" data-category="${item.category}">
                <div class="image-wrapper">
                    <div class="loading-placeholder">
                        <div class="loading-spinner"></div>
                    </div>
                    ${item.type === 'video' ? `
                        <video class="portfolio-media" poster="${item.thumbnail}" controls>
                            <source src="${item.url}" type="video/mp4">
                        </video>
                    ` : `
                        <img 
                            src="${item.url}"
                            alt="${item.title}"
                            class="portfolio-media"
                            style="opacity: 1; display: block;"
                            onerror="this.onerror=null; this.src='images/placeholder.jpg'; this.classList.add('error');"
                            onload="this.parentElement.querySelector('.loading-placeholder').style.display='none';"
                        >
                    `}
                </div>
                <div class="portfolio-item-title">${item.title}</div>
            </div>
        `;
    }).join('');
}

// Update filter functionality
function attachFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            const items = document.querySelectorAll('.portfolio-item');
            
            items.forEach(item => {
                // First hide all items with animation
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        const category = item.getAttribute('data-category');
                        if (category === filter) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }
                }, 300);
            });
        });
    });
}

// Add smooth animation for skill percentages
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        const bar = skill.querySelector('.progress-bar');
        const percent = skill.querySelector('span:last-child');
        const width = skill.getAttribute('data-percentage');
        
        bar.style.width = width;
        percent.style.transform = 'scale(1.1)';
    });
    
    skill.addEventListener('mouseleave', () => {
        const bar = skill.querySelector('.progress-bar');
        const percent = skill.querySelector('span:last-child');
        
        bar.style.width = '0';
        percent.style.transform = 'scale(1)';
    });
});

// Add this new CSS animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .portfolio-item {
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
        }
    </style>
`);

const skills = document.querySelectorAll('.skills span');
skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
    skill.classList.add('animate-skill');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Footer Animation Functions
const initFooterAnimations = () => {
    // Scroll trigger for footer elements
    const footerElements = document.querySelectorAll('.footer-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    footerElements.forEach(element => observer.observe(element));

    // Social Icons Float Animation
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-10px) scale(1.1)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact Cards Reveal
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 * index);
    });
};

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    init().then(() => {
        // Initialize filters after content is loaded
        attachFilterListeners();
    }).catch(error => {
        console.error('Failed to initialize:', error);
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p>Error loading portfolio items. Please check console for details.</p>';
        }
    });

    // Video quality control
    const video = document.getElementById('heroVideo');
    if (video) {
        // Force 1080p quality by setting video height
        video.addEventListener('loadedmetadata', () => {
            if (video.videoHeight > 1080) {
                video.style.maxHeight = '1080px';
                video.style.width = 'auto';
                video.style.position = 'absolute';
                video.style.left = '50%';
                video.style.top = '50%';
                video.style.transform = 'translate(-50%, -50%)';
            }
        });
    }

    initFooterAnimations();
    updateSkillIcons();
    initThemeToggle();

    // Pre-load critical images
    const criticalImages = document.querySelectorAll('.logo-img, .profile-image');
    criticalImages.forEach(img => {
        if (img.complete) return;
        img.style.opacity = '0';
        img.onload = () => {
            img.style.opacity = '1';
        };
    });
});

// ...existing code...

function animateSkill(skill) {
    const bar = skill.querySelector('.skill-bar');
    const percentageSpan = skill.querySelector('.skill-percentage');
    const targetPercentage = skill.dataset.percentage;
    let currentPercentage = 0;

    const animation = setInterval(() => {
        if (currentPercentage >= targetPercentage) {
            clearInterval(animation);
            return;
        }
        currentPercentage++;
        bar.style.width = `${currentPercentage}%`;
        percentageSpan.textContent = `${currentPercentage}%`;
    }, 15);
}

document.querySelectorAll('.skill').forEach(skill => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkill(skill);
                observer.unobserve(skill);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skill);
});

// Add skill icons
const skillIcons = {
    'autocad': 'fas fa-drafting-compass',
    'sketchup': 'fas fa-cube',
    '3dsmax': 'fas fa-cube',
    'vraycorona': 'fas fa-sun',
    'lumion': 'fas fa-mountain',
    'd5render': 'fas fa-paint-brush',
    'photoshop': 'fab fa-adobe',
    'twinmotion': 'fas fa-vr-cardboard',
    'enscape': 'fas fa-eye',
    'revit': 'fas fa-building'
};

function updateSkillIcons() {
    document.querySelectorAll('.skill').forEach(skill => {
        const skillName = skill.getAttribute('data-skill');
        const icon = skillIcons[skillName] || 'fas fa-code';
        
        skill.insertAdjacentHTML('afterbegin', `
            <i class="skill-icon ${icon}"></i>
        `);
    });
}

// Add this at the beginning of the file
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        // Toggle icon
        if (isDark) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// ...existing code...
