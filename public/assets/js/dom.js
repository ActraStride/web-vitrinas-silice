// js/dom.js
export const elements = {
    body: document.body,
    header: document.getElementById('header'),
    modal: document.getElementById('contactModal'),
    contactNavBtn: document.getElementById('contactNavBtn'),
    requestQuoteBtn: document.getElementById('requestQuoteBtn'),
    scheduleVisitBtn: document.getElementById('scheduleVisitBtn'),
    contactForm: document.getElementById('contactForm'),
    navLinksContainer: document.getElementById('navLinks'),
    allNavLinks: document.querySelectorAll('#navLinks a'),
    contentWrapper: document.querySelector('.content-wrapper'),
    contentElements: document.querySelectorAll('[data-content]'),
    productsGrid: document.querySelector('[data-content="productsGrid"]'),
    hamburger: document.getElementById('hamburgerMenu'),
    menuOverlay: document.getElementById('menuOverlay')
};