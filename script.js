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

// Run animations on scroll
window.addEventListener('scroll', () => {
    animateSkills();
    animatePortfolio();
});

// Run stats animation on page load
window.addEventListener('load', () => {
    animateStats();
});
