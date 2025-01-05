const CONFIG = {
    CAROUSEL_PATH: 'assets/content/carousel',
    PORTFOLIO_PATH: 'assets/content/portfolio',
    ITEMS_PER_PAGE: 12,
    // Define carousel images (1.jpg to 10.jpg)
    CAROUSEL_IMAGES: Array.from({ length: 10 }, (_, i) => 
        `assets/content/carousel/${i + 1}.jpg`
    ),
    // Portfolio images config
    IMAGES: {
        'commercial': Array.from({ length: 100 }, (_, i) => 
            `assets/content/commercial/commercial${i + 1}.jpg`
        ),
        'exterior': Array.from({ length: 100 }, (_, i) => 
            `assets/content/exterior/exterior${i + 1}.jpg`
        ),
        'interior': Array.from({ length: 100 }, (_, i) => 
            `assets/content/interior/interior${i + 1}.jpg`
        ),
        '2d-floor-plans': Array.from({ length: 100 }, (_, i) => 
            `assets/content/2dplans/2d-plan${i + 1}.jpg`
        ),
        '3d-floor-plans': Array.from({ length: 100 }, (_, i) => 
            `assets/content/3dplans/3d-plan${i + 1}.jpg`
        ),
        'society': Array.from({ length: 100 }, (_, i) => 
            `assets/content/society/society${i + 1}.jpg`
        ),
        'landscapes': Array.from({ length: 100 }, (_, i) => 
            `assets/content/landscapes/landscape${i + 1}.jpg`
        )
        // Removed autocad from images config
    }
};
