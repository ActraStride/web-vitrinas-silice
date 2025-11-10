const GTM_ID = 'GTM-KP4V392P'; // Tu ID de GTM aquí

export function initTracking() {
    // No ejecutar en entornos de desarrollo local si no quieres
    if (window.location.hostname === 'localhost') {
        console.log('Tracking scripts disabled on localhost.');
        return;
    }

    // --- Inyectar Script del <head> ---
    const gtmHeadScript = document.createElement('script');
    gtmHeadScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');`;
    document.head.prepend(gtmHeadScript); // 'prepend' para asegurar que esté al principio

}