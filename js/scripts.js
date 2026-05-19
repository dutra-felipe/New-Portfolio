// ── Theme toggle ─────────────────────────────────────────────
window.toggleTheme = function() {
    const body = document.body;
    body.classList.toggle('light-mode');
    document.getElementById('theme-icon').textContent = body.classList.contains('light-mode') ? '●' : '◐';
};

document.addEventListener('DOMContentLoaded', () => {

    // ── Typing animation ──────────────────────────────────────────
    const lines = [
        "Ciência da Computação @ IDP",
        "Software Engineer | Python, AWS & Docker",
        "Backend, Cloud Developer & DevSecOps Mindset"
    ];
    let lineIdx = 0, charIdx = 0, deleting = false;
    const el = document.getElementById('typed-tagline');

    if (el) {
        function type() {
            const current = lines[lineIdx];
            if (!deleting) {
                el.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 2200);
                    return;
                }
            } else {
                el.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    lineIdx = (lineIdx + 1) % lines.length;
                }
            }
            setTimeout(type, deleting ? 40 : 60);
        }
        type();
    }

    // ── Navbar scroll shrink ─────────────────────────────────────
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // ── Active nav link on scroll ────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { threshold: 0.4 });
        sections.forEach(s => observer.observe(s));
    }

    // ── Skill nodes animation on scroll ────────────────────────────
    const skillsGrid = document.querySelectorAll('.skills-grid');
    if (skillsGrid.length > 0) {
        const skillObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const containers = e.target.querySelectorAll('.lvl-nodes');
                    
                    containers.forEach(container => {
                        const level = parseInt(container.getAttribute('data-level')) || 0;
                        const nodes = container.querySelectorAll('.node');
                        
                        nodes.forEach((node, index) => {
                            if (index < level) {
                                setTimeout(() => {
                                    node.classList.add('active');
                                }, index * 150);
                            }
                        });
                    });
                    
                    skillObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillsGrid.forEach(g => skillObserver.observe(g));
    }

});