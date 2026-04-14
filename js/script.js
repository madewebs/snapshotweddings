import galleryData from './gallery-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.getElementById('main-navbar');
    const navLinks = document.querySelectorAll('.navbar__link');
    const navToggle = document.querySelector('.navbar__toggle');
    const navMenu = document.querySelector('.navbar__menu');
    const galleryGrid = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.gallery__filter-btn');
    
    // Modal Elements
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    let currentItemIndex = 0;
    let currentGallerySet = [...galleryData];

    /* --- MOBILE MENU --- */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    /* --- SMOTH SCROLL & NAVIGATION --- */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    });

    // Close mobile menu on link click (if implemented)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Optional: Handle mobile nav toggle here
        });
    });

    /* --- GALLERY ENGINE --- */
    function renderGallery(items) {
        galleryGrid.innerHTML = '';
        
        items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'gallery__item';
            el.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.alt}" loading="lazy">
                <div class="gallery__overlay">
                    <span class="gallery__category">${item.category}</span>
                    <h3 class="gallery__title">${item.title}</h3>
                </div>
            `;
            
            el.addEventListener('click', () => openModal(index, items));
            galleryGrid.appendChild(el);
        });
    }

    /* --- FILTERING LOGIC --- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // UI Update
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Data Filter
            currentGallerySet = filter === 'all' 
                ? [...galleryData] 
                : galleryData.filter(item => item.category === filter);

            // Smooth Transition
            galleryGrid.style.opacity = '0';
            galleryGrid.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                renderGallery(currentGallerySet);
                galleryGrid.style.opacity = '1';
                galleryGrid.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    /* --- MODAL SYSTEM --- */
    function openModal(index, set) {
        currentItemIndex = index;
        currentGallerySet = set;
        updateModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModal() {
        const item = currentGallerySet[currentItemIndex];
        
        // Add fade-out transition
        modalImg.style.opacity = '0';
        modalImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            modalImg.src = item.thumbnail;
            modalImg.alt = item.alt;
            modalTitle.textContent = item.title;
            modalDesc.textContent = item.description;
            
            // Fade back in
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        }, 200);
    }

    function handleNext() {
        currentItemIndex = (currentItemIndex + 1) % currentGallerySet.length;
        updateModal();
    }

    function handlePrev() {
        currentItemIndex = (currentItemIndex - 1 + currentGallerySet.length) % currentGallerySet.length;
        updateModal();
    }

    // Modal Listeners
    modalClose.addEventListener('click', closeModal);
    modalNext.addEventListener('click', handleNext);
    modalPrev.addEventListener('click', handlePrev);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal__overlay')) closeModal();
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    });

    /* --- INITIALIZATION --- */
    renderGallery(galleryData);
});
