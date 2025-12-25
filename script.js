document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. AUTO-INJECT CSS FOR PROFESSIONAL LOADER ---
    // Ye magic code button ke andar spinner banayega
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        /* Loader ka design */
        .button-loader {
            border: 3px solid rgba(255, 255, 255, 0.3); /* Halka border */
            border-top: 3px solid #ffffff; /* Gada border upar (jo ghumega) */
            border-radius: 50%; /* Golakar */
            width: 20px;
            height: 20px;
            animation: spin-loader 0.8s linear infinite; /* Ghumne ki speed */
            margin: auto; /* Center me */
            display: block;
        }

        /* Ghumne ki animation */
        @keyframes spin-loader {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Jab loading ho rhi ho to cursor change na ho */
        button:disabled {
            cursor: not-allowed;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(styleSheet);


    // --- 1. ICONS INITIALIZE ---
    lucide.createIcons();

    // --- 2. THEME TOGGLE LOGIC ---
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        body.classList.add('dark');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        body.classList.remove('dark');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if(themeIcon) themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            lucide.createIcons();
        });
    }

    // --- 3. MOBILE MENU ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            if(menuIcon) {
                menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });
    }

    // --- 4. CONTACT FORM (PROFESSIONAL LOADER FIX) ---
    const contactForm = document.getElementById('contact-form');
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwOF_VcUooa_VZcoWz3xfmLbVCGqy_RzlAvnHCHuvvUPHRsGen_FGdMktpkwuzLJ1rh_g/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            // 1. Purana content save karo (Text + Icon)
            const originalContent = submitBtn.innerHTML;
            
            // 2. Button ko disable karo aur Loader dikhao
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="button-loader"></div>'; // LOADER INSERTED HERE

            const formParams = new URLSearchParams(new FormData(contactForm));

            try {
                const response = await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    body: formParams
                });

                const result = await response.json();

                if (result.result === 'success') {
                    contactForm.reset();
                    const toast = document.getElementById("toast");
                    toast.className = "show";
                    setTimeout(function(){ 
                        toast.className = toast.className.replace("show", ""); 
                    }, 3000);
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Something went wrong. Please try again.");
            } finally {
                // 3. Wapas purana content lao aur button enable karo
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                // Zaroori: Kyunki humne HTML replace kiya tha, icons ko dobara load karna padega
                lucide.createIcons(); 
            }
        });
    }

    // --- 5. COUNTER ANIMATION ---
    const observeStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.achievement-number');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    if (!isNaN(target)) {
                        const duration = 2000; 
                        const increment = target / (duration / 16); 
                        let current = 0;
                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                if (target % 1 !== 0) {
                                    counter.innerText = current.toFixed(1);
                                } else {
                                    counter.innerText = Math.ceil(current);
                                }
                                requestAnimationFrame(updateCount);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    }
                });
                observeStats.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.achievements');
    if (statsSection) {
        observeStats.observe(statsSection);
    }
});