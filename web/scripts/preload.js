// Предзагрузка изображений
const preloadImage = (src) => (new Image().src = src)
if (window.screen.width > 876) {
    [
        "./web/assets/home-bg.png",
        "./web/assets/registration-bg.png"
    ].forEach(preloadImage)
}

if (window.screen.width <= 876) {
    [
        "./web/assets/home-bg-phone.png",
        "./web/assets/registration-bg-phone.png"
    ].forEach(preloadImage)
}