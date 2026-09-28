/**
 * Smart Campus Navigation System - High Performance Presentation Logic
 * Optimized for ultra-fast response, zero layout thrashing, and buttery smooth 60-120fps scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Theme Toggle (Instant with local storage cache)
    // ---------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const rootEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            rootEl.setAttribute('data-theme', 'dark');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
        } else {
            rootEl.removeAttribute('data-theme');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
        }
    }

    const savedTheme = localStorage.getItem('ghrce_theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = rootEl.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('ghrce_theme', nextTheme);
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 2. High-Performance Scroll Handling (rAF + Passive Listeners)
    // ---------------------------------------------------------
    const progressBar = document.getElementById('progress-bar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    let ticking = false;

    function onScrollUpdate() {
        const scrollTop = window.pageYOffset || rootEl.scrollTop || document.body.scrollTop || 0;
        const scrollHeight = (rootEl.scrollHeight || document.body.scrollHeight) - window.innerHeight;
        
        if (progressBar && scrollHeight > 0) {
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                if (!backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.add('visible');
                }
            } else {
                if (backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.remove('visible');
                }
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScrollUpdate);
            ticking = true;
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------------------------------------------------------
    // 3. Active Section Tracking using IntersectionObserver (Zero layout thrashing)
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    const navMap = new Map();

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
            navMap.set(href.substring(1), item);
        }
    });

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navItems.forEach(link => link.classList.remove('active'));
                    const activeLink = navMap.get(id);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ---------------------------------------------------------
    // 4. Mobile Menu & More Dropdown Toggle
    // ---------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navDropdown = document.getElementById('navDropdown');
    const navDropdownBtn = document.getElementById('navDropdownBtn');
    const navDropdownMenu = document.getElementById('navDropdownMenu');

    if (navDropdownBtn && navDropdown) {
        navDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navDropdown.classList.toggle('open');
            const isOpen = navDropdown.classList.contains('open');
            navDropdownBtn.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (navDropdown && !navDropdown.contains(e.target)) {
                navDropdown.classList.remove('open');
                if (navDropdownBtn) navDropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });

        if (navDropdownMenu) {
            navDropdownMenu.addEventListener('click', () => {
                navDropdown.classList.remove('open');
                if (navDropdownBtn) navDropdownBtn.setAttribute('aria-expanded', 'false');
            });
        }
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && !e.target.classList.contains('nav-dropdown-btn') || e.target.classList.contains('dropdown-item')) {
                navLinks.classList.remove('nav-active');
            }
        });
    }

    // ---------------------------------------------------------
    // 5. Fast Module Search Filter (DocumentFragment / CSS toggle)
    // ---------------------------------------------------------
    const moduleFilterInput = document.getElementById('moduleFilterInput');
    const moduleCards = document.querySelectorAll('.module-card');
    const moduleCountText = document.getElementById('moduleCountText');

    if (moduleFilterInput && moduleCards.length > 0) {
        // Precache text search tokens for instantaneous search
        const cardCache = Array.from(moduleCards).map(card => ({
            el: card,
            text: (card.getAttribute('data-title') + ' ' + card.innerText).toLowerCase()
        }));

        moduleFilterInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            for (let i = 0; i < cardCache.length; i++) {
                const item = cardCache[i];
                if (!query || item.text.includes(query)) {
                    item.el.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.el.style.display = 'none';
                }
            }

            if (moduleCountText) {
                moduleCountText.textContent = `Showing ${visibleCount} of ${cardCache.length} Modules`;
            }
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 6. Fast Literature Survey Table Search Filter
    // ---------------------------------------------------------
    const litSearchInput = document.getElementById('litSearchInput');
    const litTable = document.getElementById('literatureTable');
    const litCountText = document.getElementById('litCountText');

    if (litSearchInput && litTable) {
        const rows = litTable.querySelectorAll('tbody tr');
        const rowCache = Array.from(rows).map(row => ({
            el: row,
            text: row.innerText.toLowerCase()
        }));

        litSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            for (let i = 0; i < rowCache.length; i++) {
                const item = rowCache[i];
                if (!query || item.text.includes(query)) {
                    item.el.style.display = '';
                    visibleCount++;
                } else {
                    item.el.style.display = 'none';
                }
            }

            if (litCountText) {
                litCountText.textContent = `Showing ${visibleCount} of ${rowCache.length} Research Papers`;
            }
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 7. CSE Department Navigation Map & Route Simulator
    // ---------------------------------------------------------
    const startNodeSelect = document.getElementById('startNodeSelect');
    const endNodeSelect = document.getElementById('endNodeSelect');
    const calculateRouteBtn = document.getElementById('calculateRouteBtn');
    const stepGuideBox = document.getElementById('stepGuideBox');
    const dynamicRoutePath = document.getElementById('dynamicRoutePath');
    const startMarkerCircle = document.getElementById('startMarkerCircle');
    const endMarkerCircle = document.getElementById('endMarkerCircle');

    // Room Detail Card Elements
    const roomSingleMediaWrap = document.getElementById('roomSingleMediaWrap');
    const roomGalleryWrap = document.getElementById('roomGalleryWrap');
    const roomDetailImg = document.getElementById('roomDetailImg');
    const galleryItem1 = document.getElementById('galleryItem1');
    const galleryItem2 = document.getElementById('galleryItem2');
    const roomCodeBadge = document.getElementById('roomCodeBadge');
    const roomTitle = document.getElementById('roomTitle');
    const roomIncharge = document.getElementById('roomIncharge');
    const roomInchargeRow = document.getElementById('roomInchargeRow');
    const roomCaption = document.getElementById('roomCaption');

    // Lightbox Modal Elements
    const photoLightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxOverlay = document.getElementById('lightboxOverlay');

    const nodeCoords = {
        gate: {
            x: 380,
            y: 475,
            markerX: 380,
            markerY: 475,
            doorX: 380,
            doorY: 475,
            code: "Main Gate",
            name: "Main Campus Entrance (Gate)",
            incharge: "Campus Security & Reception",
            isDual: false,
            photo: "Images/Main_gate_raisoni.jpeg",
            alt: "Main Gate entrance of G H Raisoni College of Engineering",
            caption: "Starting point at the GHRCE Main Campus Gate."
        },
        b01: {
            x: 102,
            y: 102,
            markerX: 102,
            markerY: 102,
            doorX: 100,
            doorY: 150,
            code: "Room B-01",
            name: "B-01 Project Laboratory",
            incharge: "Dr. Apeksha V. Sakhare (Assistant Professor)",
            isDual: false,
            photo: "Images/PRATICAL_LAP.jpeg",
            alt: "B-01 Project Laboratory entrance and signage",
            caption: "Entrance to Project Laboratory B-01 (signboard on the left side of doorway)."
        },
        b02: {
            x: 662,
            y: 275,
            markerX: 585,
            markerY: 275,
            doorX: 585,
            doorY: 275,
            code: "Room B-02",
            name: "B-02 Networks & Information Security Lab",
            incharge: "Dr. Shruti A. Thakur (Assistant Professor)",
            isDual: false,
            photo: "Images/B-02.jpeg",
            alt: "B-02 Networks and Information Security Laboratory entrance",
            caption: "Networks & Information Security Lab located on the right walkway of the CSE Department."
        },
        b03: {
            x: 492,
            y: 102,
            markerX: 490,
            markerY: 150,
            doorX: 490,
            doorY: 150,
            code: "Room B-03",
            name: "B-03 CCC (Centralised Computer Centre)",
            incharge: "Dr. Girish R. Talmale (Assistant Professor)",
            isDual: true,
            photo: "Images/centralized_computer_center.jpeg",
            alt: "B-03 Centralised Computer Centre",
            photos: [
                {
                    src: "Images/centralized_computer_center.jpeg",
                    alt: "Centralised Computer Centre outside entrance view",
                    caption: "B-03 Centralised Computer Centre (outside entrance view)"
                },
                {
                    src: "Images/B-03.jpeg",
                    alt: "Centralised Computer Centre interior lab view",
                    caption: "B-03 Centralised Computer Centre (inside view)"
                }
            ],
            caption: "Centralised Computer Centre (CCC) on the top edge corridor (outside entrance & inside view)."
        },
        b04: {
            x: 272,
            y: 102,
            markerX: 270,
            markerY: 150,
            doorX: 270,
            doorY: 150,
            code: "Room B-04",
            name: "B-04 Data Science Lab (Center of Excellence in Data Science)",
            incharge: "Dr. Aditya N. Turankar (Assistant Professor)",
            isDual: false,
            photo: "Images/PRATICAL_LAP.jpeg",
            alt: "B-04 Data Science Lab doorway signage",
            caption: "Signboard for B-04 Data Science Lab is mounted on the right side of the doorway."
        },
        b05: {
            x: 197,
            y: 275,
            markerX: 265,
            markerY: 275,
            doorX: 265,
            doorY: 275,
            code: "Room B-05",
            name: "B-05 CSE Department, HOD Cabin",
            incharge: "Head of Department (CSE) Cabin & Department Office",
            isDual: false,
            photo: "Images/B-05.jpeg",
            alt: "B-05 CSE Department Head of Department Cabin entrance",
            caption: "Head of Department (CSE) Cabin located along the left walkway of the department."
        }
    };

    // Waypoints for floor-plan walkway graph
    const wp = {
        P_gate: [380, 475],
        W_g1: [280, 430],
        W_g2: [420, 430],
        W_ent: [420, 360],
        W_bl: [290, 360],
        W_br: [560, 360],
        W_b05: [290, 275],
        W_b02: [560, 275],
        W_tl: [290, 175],
        W_tr: [560, 175],
        W_b03: [490, 175],
        W_b04: [270, 175],
        W_b01: [100, 175],
        D_gate: [380, 475],
        D_b05: [265, 275],
        D_b02: [585, 275],
        D_b03: [490, 150],
        D_b04: [270, 150],
        D_b01: [100, 150]
    };

    function pointsToSvgPath(pts) {
        if (!pts || pts.length === 0) return '';
        return 'M ' + pts.map(p => `${p[0]},${p[1]}`).join(' L ');
    }

    function getRouteData(startKey, endKey) {
        const s = nodeCoords[startKey] || nodeCoords.gate;
        const e = nodeCoords[endKey] || nodeCoords.b02;

        if (startKey === endKey) {
            return {
                pathStr: `M ${e.doorX},${e.doorY} L ${e.doorX + 0.1},${e.doorY + 0.1}`,
                steps: [`You are already at <strong>${e.name}</strong>.`]
            };
        }

        // 1. From Gate
        if (startKey === 'gate') {
            if (endKey === 'b02') {
                return {
                    pathStr: pointsToSvgPath([wp.P_gate, wp.W_g1, wp.W_g2, wp.W_ent, wp.W_br, wp.W_b02, wp.D_b02]),
                    steps: [
                        "Start at Main Gate",
                        "Walk in along the ground-floor path",
                        "Enter the CSE department walkway loop",
                        "Turn right along the eastern walkway",
                        "B-02 Networks & Information Security Lab is on your right side"
                    ]
                };
            }
            if (endKey === 'b05') {
                return {
                    pathStr: pointsToSvgPath([wp.P_gate, wp.W_g1, wp.W_g2, wp.W_ent, wp.W_bl, wp.W_b05, wp.D_b05]),
                    steps: [
                        "Start at Main Gate",
                        "Walk in along the ground-floor path",
                        "Enter the CSE department walkway loop",
                        "Turn left along the western walkway",
                        "B-05 CSE Department HOD Cabin is on your left side"
                    ]
                };
            }
            if (endKey === 'b03') {
                return {
                    pathStr: pointsToSvgPath([wp.P_gate, wp.W_g1, wp.W_g2, wp.W_ent, wp.W_br, wp.W_tr, wp.W_b03, wp.D_b03]),
                    steps: [
                        "Start at Main Gate",
                        "Walk in along the ground-floor path",
                        "Enter the CSE department walkway loop",
                        "Follow the walkway up to the top edge toward the right",
                        "B-03 CCC (Centralised Computer Centre) is on the top edge"
                    ]
                };
            }
            if (endKey === 'b04') {
                return {
                    pathStr: pointsToSvgPath([wp.P_gate, wp.W_g1, wp.W_g2, wp.W_ent, wp.W_bl, wp.W_b05, wp.W_tl, wp.W_b04, wp.D_b04]),
                    steps: [
                        "Start at Main Gate",
                        "Walk in along the ground-floor path",
                        "Enter the CSE department walkway loop and proceed along the left corridor",
                        "From the top corner, continue along the corridor to the LEFT",
                        "B-04 Data Science Lab is on your left-hand side (sign on right of doorway)"
                    ]
                };
            }
            if (endKey === 'b01') {
                return {
                    pathStr: pointsToSvgPath([wp.P_gate, wp.W_g1, wp.W_g2, wp.W_ent, wp.W_bl, wp.W_b05, wp.W_tl, wp.W_b01, wp.D_b01]),
                    steps: [
                        "Start at Main Gate",
                        "Walk in along the ground-floor path",
                        "Enter the CSE department walkway loop and proceed along the left corridor",
                        "From the top corner, continue along the corridor to the LEFT",
                        "B-01 Project Laboratory is on your right-hand side"
                    ]
                };
            }
        }

        // 2. To Gate
        if (endKey === 'gate') {
            const rev = getRouteData('gate', startKey);
            const revPoints = rev.pathStr.replace(/^M\s+/, '').split(/\s+L\s+/).reverse().map(s => s.split(',').map(Number));
            return {
                pathStr: pointsToSvgPath(revPoints),
                steps: [
                    `Exit ${s.name} onto the walkway`,
                    "Follow the CSE department walkway loop to the ground-floor exit",
                    "Walk along the ground-floor path leading downward",
                    "Arrive at Main Gate"
                ]
            };
        }

        // 3. Room to Room
        if (startKey === 'b01' && endKey === 'b04') {
            return {
                pathStr: pointsToSvgPath([wp.D_b01, wp.W_b01, wp.W_b04, wp.D_b04]),
                steps: [
                    "Start at B-01 Project Laboratory",
                    "Walk east along the corridor",
                    "B-04 Data Science Lab is located right beside on the doorway"
                ]
            };
        }
        if (startKey === 'b04' && endKey === 'b01') {
            return {
                pathStr: pointsToSvgPath([wp.D_b04, wp.W_b04, wp.W_b01, wp.D_b01]),
                steps: [
                    "Start at B-04 Data Science Lab",
                    "Walk along the corridor further to the LEFT",
                    "B-01 Project Laboratory is on your right-hand side"
                ]
            };
        }
        if (startKey === 'b03' && endKey === 'b04') {
            return {
                pathStr: pointsToSvgPath([wp.D_b03, wp.W_b03, wp.W_tl, wp.W_b04, wp.D_b04]),
                steps: [
                    "Exit B-03 CCC (Centralised Computer Centre)",
                    "Walk west along the top walkway",
                    "Continue along the corridor to the LEFT",
                    "B-04 Data Science Lab is on the left-hand side"
                ]
            };
        }
        if (startKey === 'b04' && endKey === 'b03') {
            return {
                pathStr: pointsToSvgPath([wp.D_b04, wp.W_b04, wp.W_tl, wp.W_b03, wp.D_b03]),
                steps: [
                    "Exit B-04 Data Science Lab into the corridor",
                    "Walk east into the department walkway loop",
                    "Follow the top walkway toward the right",
                    "Arrive at B-03 CCC (Centralised Computer Centre)"
                ]
            };
        }
        if (startKey === 'b03' && endKey === 'b01') {
            return {
                pathStr: pointsToSvgPath([wp.D_b03, wp.W_b03, wp.W_tl, wp.W_b01, wp.D_b01]),
                steps: [
                    "Exit B-03 CCC (Centralised Computer Centre)",
                    "Walk along the top edge corridor to the LEFT",
                    "Continue to the end of the corridor",
                    "B-01 Project Laboratory is on your right-hand side"
                ]
            };
        }
        if (startKey === 'b01' && endKey === 'b03') {
            return {
                pathStr: pointsToSvgPath([wp.D_b01, wp.W_b01, wp.W_tl, wp.W_b03, wp.D_b03]),
                steps: [
                    "Exit B-01 Project Laboratory into the corridor",
                    "Walk east into the department walkway loop",
                    "Follow the top walkway toward the right",
                    "Arrive at B-03 CCC (Centralised Computer Centre)"
                ]
            };
        }
        if (startKey === 'b05' && endKey === 'b02') {
            return {
                pathStr: pointsToSvgPath([wp.D_b05, wp.W_b05, wp.W_bl, wp.W_br, wp.W_b02, wp.D_b02]),
                steps: [
                    "Exit B-05 CSE Department HOD Cabin",
                    "Follow the left walkway south to the bottom corridor",
                    "Walk across the bottom walkway to the right corridor",
                    "B-02 Networks & Information Security Lab is on your right side"
                ]
            };
        }
        if (startKey === 'b02' && endKey === 'b05') {
            return {
                pathStr: pointsToSvgPath([wp.D_b02, wp.W_b02, wp.W_br, wp.W_bl, wp.W_b05, wp.D_b05]),
                steps: [
                    "Exit B-02 Networks & Information Security Lab",
                    "Follow the right walkway south to the bottom corridor",
                    "Walk across the bottom walkway to the left corridor",
                    "B-05 CSE Department HOD Cabin is on your left side"
                ]
            };
        }
        if (startKey === 'b02' && endKey === 'b03') {
            return {
                pathStr: pointsToSvgPath([wp.D_b02, wp.W_b02, wp.W_tr, wp.W_b03, wp.D_b03]),
                steps: [
                    "Exit B-02 Networks & Information Security Lab",
                    "Walk north along the right corridor up to the top edge",
                    "Turn left onto the top walkway",
                    "Arrive at B-03 CCC (Centralised Computer Centre)"
                ]
            };
        }
        if (startKey === 'b03' && endKey === 'b02') {
            return {
                pathStr: pointsToSvgPath([wp.D_b03, wp.W_b03, wp.W_tr, wp.W_b02, wp.D_b02]),
                steps: [
                    "Exit B-03 CCC (Centralised Computer Centre)",
                    "Follow the top walkway to the right corner",
                    "Turn south along the eastern corridor",
                    "B-02 Networks & Information Security Lab is on your left side"
                ]
            };
        }
        if (startKey === 'b05' && endKey === 'b04') {
            return {
                pathStr: pointsToSvgPath([wp.D_b05, wp.W_b05, wp.W_tl, wp.W_b04, wp.D_b04]),
                steps: [
                    "Exit B-05 CSE Department HOD Cabin",
                    "Walk north along the left corridor to the top corner",
                    "Continue along the corridor to the LEFT",
                    "B-04 Data Science Lab is on the left-hand side"
                ]
            };
        }
        if (startKey === 'b04' && endKey === 'b05') {
            return {
                pathStr: pointsToSvgPath([wp.D_b04, wp.W_b04, wp.W_tl, wp.W_b05, wp.D_b05]),
                steps: [
                    "Exit B-04 Data Science Lab into the corridor",
                    "Walk east to the department walkway loop corner",
                    "Turn south along the left walkway",
                    "B-05 CSE Department HOD Cabin is on your right side"
                ]
            };
        }
        if (startKey === 'b05' && endKey === 'b01') {
            return {
                pathStr: pointsToSvgPath([wp.D_b05, wp.W_b05, wp.W_tl, wp.W_b01, wp.D_b01]),
                steps: [
                    "Exit B-05 CSE Department HOD Cabin",
                    "Walk north along the left corridor to the top corner",
                    "Continue along the corridor to the LEFT",
                    "B-01 Project Laboratory is on your right-hand side"
                ]
            };
        }
        if (startKey === 'b01' && endKey === 'b05') {
            return {
                pathStr: pointsToSvgPath([wp.D_b01, wp.W_b01, wp.W_tl, wp.W_b05, wp.D_b05]),
                steps: [
                    "Exit B-01 Project Laboratory into the corridor",
                    "Walk east along the corridor to the department loop corner",
                    "Turn south along the left walkway",
                    "B-05 CSE Department HOD Cabin is on your right side"
                ]
            };
        }
        if (startKey === 'b05' && endKey === 'b03') {
            return {
                pathStr: pointsToSvgPath([wp.D_b05, wp.W_b05, wp.W_tl, wp.W_b03, wp.D_b03]),
                steps: [
                    "Exit B-05 CSE Department HOD Cabin",
                    "Walk north along the left corridor to the top corner",
                    "Follow the top walkway toward the right",
                    "B-03 CCC (Centralised Computer Centre) is on the top edge"
                ]
            };
        }
        if (startKey === 'b03' && endKey === 'b05') {
            return {
                pathStr: pointsToSvgPath([wp.D_b03, wp.W_b03, wp.W_tl, wp.W_b05, wp.D_b05]),
                steps: [
                    "Exit B-03 CCC (Centralised Computer Centre)",
                    "Walk west along the top walkway to the left corner",
                    "Follow the left corridor south",
                    "B-05 CSE Department HOD Cabin is on your right side"
                ]
            };
        }
        if (startKey === 'b02' && endKey === 'b01') {
            return {
                pathStr: pointsToSvgPath([wp.D_b02, wp.W_b02, wp.W_tr, wp.W_tl, wp.W_b01, wp.D_b01]),
                steps: [
                    "Exit B-02 Networks & Information Security Lab",
                    "Walk north along the right corridor up to the top edge",
                    "Follow the top walkway across and continue into the corridor to the LEFT",
                    "B-01 Project Laboratory is on your right-hand side"
                ]
            };
        }
        if (startKey === 'b01' && endKey === 'b02') {
            return {
                pathStr: pointsToSvgPath([wp.D_b01, wp.W_b01, wp.W_tl, wp.W_tr, wp.W_b02, wp.D_b02]),
                steps: [
                    "Exit B-01 Project Laboratory into the corridor",
                    "Walk east along the corridor into the department walkway loop",
                    "Follow the top walkway across to the eastern corridor",
                    "B-02 Networks & Information Security Lab is on your right side"
                ]
            };
        }
        if (startKey === 'b02' && endKey === 'b04') {
            return {
                pathStr: pointsToSvgPath([wp.D_b02, wp.W_b02, wp.W_tr, wp.W_tl, wp.W_b04, wp.D_b04]),
                steps: [
                    "Exit B-02 Networks & Information Security Lab",
                    "Walk north along the right corridor up to the top edge",
                    "Follow the walkway across and continue into the corridor to the LEFT",
                    "B-04 Data Science Lab is on your left-hand side"
                ]
            };
        }
        if (startKey === 'b04' && endKey === 'b02') {
            return {
                pathStr: pointsToSvgPath([wp.D_b04, wp.W_b04, wp.W_tl, wp.W_tr, wp.W_b02, wp.D_b02]),
                steps: [
                    "Exit B-04 Data Science Lab into the corridor",
                    "Walk east into the department walkway loop",
                    "Follow the top walkway across to the eastern corridor",
                    "B-02 Networks & Information Security Lab is on your right side"
                ]
            };
        }

        // Generic fallback route
        return {
            pathStr: `M ${s.doorX || s.x},${s.doorY || s.y} L ${e.doorX || e.x},${e.doorY || e.y}`,
            steps: [
                `Start at ${s.name}`,
                "Follow the CSE Department walkway loop",
                `Arrive at destination: ${e.name}`
            ]
        };
    }

    // Lightbox open/close functions
    function openLightbox(src, captionText, altText) {
        if (!photoLightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = altText || captionText || 'Photo enlarged view';
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText || '';
        }
        photoLightbox.classList.add('active');
        photoLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxCloseBtn) lightboxCloseBtn.focus();
    }

    function closeLightbox() {
        if (!photoLightbox) return;
        photoLightbox.classList.remove('active');
        photoLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoLightbox && photoLightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    let currentDestKey = 'b02';

    // Click handler for single photo zoom
    if (roomSingleMediaWrap) {
        roomSingleMediaWrap.addEventListener('click', () => {
            const dest = nodeCoords[currentDestKey] || nodeCoords.b02;
            openLightbox(dest.photo, dest.caption, dest.alt);
        });
    }

    // Click handler for gallery photos (B-03)
    if (galleryItem1) {
        galleryItem1.addEventListener('click', () => {
            openLightbox('Images/centralized_computer_center.jpeg', 'Centralised Computer Centre (outside entrance)', 'CCC Outside Entrance');
        });
        galleryItem1.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox('Images/centralized_computer_center.jpeg', 'Centralised Computer Centre (outside entrance)', 'CCC Outside Entrance');
            }
        });
    }

    if (galleryItem2) {
        galleryItem2.addEventListener('click', () => {
            openLightbox('Images/B-03.jpeg', 'Centralised Computer Centre (inside view)', 'CCC Inside View');
        });
        galleryItem2.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox('Images/B-03.jpeg', 'Centralised Computer Centre (inside view)', 'CCC Inside View');
            }
        });
    }

    function updateRoomCard(destKey) {
        currentDestKey = destKey;
        const dest = nodeCoords[destKey] || nodeCoords.b02;

        if (dest.isDual) {
            if (roomSingleMediaWrap) roomSingleMediaWrap.classList.add('hidden');
            if (roomGalleryWrap) roomGalleryWrap.classList.remove('hidden');
        } else {
            if (roomGalleryWrap) roomGalleryWrap.classList.add('hidden');
            if (roomSingleMediaWrap) {
                roomSingleMediaWrap.classList.remove('hidden');
                if (roomDetailImg) {
                    roomDetailImg.src = dest.photo;
                    roomDetailImg.alt = dest.alt || dest.name;
                }
            }
        }

        if (roomCodeBadge) roomCodeBadge.textContent = dest.code;
        if (roomTitle) roomTitle.textContent = dest.name;

        if (roomInchargeRow && roomIncharge) {
            if (dest.incharge) {
                roomInchargeRow.classList.remove('hidden');
                roomIncharge.textContent = dest.incharge;
            } else {
                roomInchargeRow.classList.add('hidden');
            }
        }

        if (roomCaption) roomCaption.textContent = dest.caption;
    }

    function calculateRoute() {
        if (!startNodeSelect || !endNodeSelect) return;
        const startKey = startNodeSelect.value;
        const endKey = endNodeSelect.value;

        const start = nodeCoords[startKey] || nodeCoords.gate;
        const end = nodeCoords[endKey] || nodeCoords.b02;

        // Position start and end marker pins
        if (startMarkerCircle) {
            startMarkerCircle.setAttribute('cx', start.markerX || start.doorX || start.x);
            startMarkerCircle.setAttribute('cy', start.markerY || start.doorY || start.y);
        }
        if (endMarkerCircle) {
            endMarkerCircle.setAttribute('cx', end.markerX || end.doorX || end.x);
            endMarkerCircle.setAttribute('cy', end.markerY || end.doorY || end.y);
        }

        // Calculate schematic path and steps
        const route = getRouteData(startKey, endKey);

        if (dynamicRoutePath) {
            dynamicRoutePath.setAttribute('d', route.pathStr);
        }

        if (stepGuideBox) {
            stepGuideBox.innerHTML = route.steps
                .map((step, idx) => `<div class="step-line"><span class="step-badge">${idx + 1}</span> ${step}</div>`)
                .join('');
        }

        // Highlight SVG rooms
        document.querySelectorAll('.map-room').forEach(el => {
            el.classList.remove('active-dest', 'active-start');
        });

        const startEl = document.getElementById(`bldg-${startKey}`);
        if (startEl) startEl.classList.add('active-start');

        const destEl = document.getElementById(`bldg-${endKey}`);
        if (destEl) destEl.classList.add('active-dest');

        // Update Room Details Card
        updateRoomCard(endKey);
    }

    if (calculateRouteBtn) calculateRouteBtn.addEventListener('click', calculateRoute, { passive: true });
    if (startNodeSelect) startNodeSelect.addEventListener('change', calculateRoute, { passive: true });
    if (endNodeSelect) endNodeSelect.addEventListener('change', calculateRoute, { passive: true });

    // Clicking room on map selects destination
    document.querySelectorAll('.map-room').forEach(room => {
        room.addEventListener('click', () => {
            const nodeId = room.getAttribute('data-node') || room.id.replace('bldg-', '');
            if (nodeCoords[nodeId] && endNodeSelect) {
                endNodeSelect.value = nodeId;
                calculateRoute();
            }
        }, { passive: true });
    });

    // Initial render
    calculateRoute();
});

