// // Предзагрузка изображений
// function preloadImage(sources) {
//     sources.forEach(src => new Image().src = src)
// } 

// // На пк
// if (window.screen.width > 876) {
//     preloadImage(
//         [
//             "./web/assets/home-bg.png",
//             "./web/assets/registration-bg.png"
//         ]
//     )
    
// }

// // На телефоне
// if (window.screen.width <= 876) {
//     preloadImage(
//         [
//             "./web/assets/home-bg-phone.png",
//             "./web/assets/registration-bg-phone.png"
//         ]
//     )
// }