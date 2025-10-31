// js/modules/scrollObserver.js
export function setupScrollObserver() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.scroll-animate');
    elementsToAnimate.forEach((element, index) => {
        element.classList.remove('visible');
        element.style.transitionDelay = `${(index % 4) * 100}ms`;
        observer.observe(element);
    });
}