const CONFIG = {
    CAROUSEL_PATH: 'assets/content/carousel',
    PORTFOLIO_PATH: 'assets/content/portfolio',
    ITEMS_PER_PAGE: 9,
    // Define carousel images (1.jpg to 10.jpg)
    CAROUSEL_IMAGES: Array.from({ length: 10 }, (_, i) => 
        `assets/content/carousel/${i + 1}.jpg`
    ),
    // Portfolio images config
    IMAGES: {
        'commercial': Array.from({ length: 18 }, (_, i) => 
            `assets/content/commercial/commercial${i + 1}.jpg`
        ),
        'exterior': Array.from({ length: 18 }, (_, i) => 
            `assets/content/exterior/exterior${i + 1}.jpg`
        ),
        'interior': Array.from({ length: 18 }, (_, i) => 
            `assets/content/interior/interior${i + 1}.jpg`
        ),
        '2d-floor-plans': Array.from({ length: 18 }, (_, i) => 
            `assets/content/2d-floor-plans/2d-plan${i + 1}.jpg`
        ),
        '3d-floor-plans': [
            'assets/content/3d-floor-plans/3d-plan1.jpg',
            'assets/content/3d-floor-plans/3d-plan2.jpg',
            'assets/content/3d-floor-plans/3d-plan3.jpg'
        ],
        'autocad': [
            'assets/content/autocad/autocad1.jpg',
            'assets/content/autocad/autocad2.jpg',
            'assets/content/autocad/autocad3.jpg'
        ],
        'society': [
            'assets/content/society/society1.jpg',
            'assets/content/society/society2.jpg',
            'assets/content/society/society3.jpg'
        ],
        'landscapes': [
            'assets/content/landscapes/landscape1.jpg',
            'assets/content/landscapes/landscape2.jpg',
            'assets/content/landscapes/landscape3.jpg'
        ],
        'animations': [
            'assets/content/animations/animation1.mp4',
            'assets/content/animations/animation2.mp4',
            'assets/content/animations/animation3.mp4'
        ]
    }
};
