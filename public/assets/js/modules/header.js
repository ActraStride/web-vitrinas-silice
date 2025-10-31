// js/modules/header.js
import { elements } from '../dom.js';

function handleHeaderScroll() {
    elements.header.classList.toggle('scrolled', window.scrollY > 50);
}

export function initHeader() {
    window.addEventListener('scroll', handleHeaderScroll);
}