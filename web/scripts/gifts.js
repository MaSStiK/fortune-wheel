let gifts // глобальный массив с данными

// Получаем информацию с сервера
$.ajax({
    url: "http://127.0.0.1:5000/wheel_data",
    method: "GET",

    success: (data) => {
        console.log("/wheel_data");
        gifts = data
        
        // Отрисовываем секцию с подарками
        renderGiftsSection()

        // Отрисовываем колесо
        renderFortuneWheel()
    }
})


// Рендер секции и призами
function renderGiftsSection() {
    for (let gift of gifts) {
        $(".gifts__container").append(`
            <div class="gifts__gift">
                <img class="gifts__gift-image" src="${gift.image_url}" alt="gift">
                <p class="gifts__gift-text">${gift.name}</p>
            </div>
        `)
    }
}