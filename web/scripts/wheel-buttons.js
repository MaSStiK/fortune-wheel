function randomNumber(min, max) { // Случайное число
    return Math.round(Math.random() * (max - min)) + min
}

// Кнопка "Понятно!"
$("#wheel-modal-agree").on("click tap", () => {
    // Скрываем модальное окно и разблокируем кнопку
    $(".wheel__modal").hide()
    $("#wheel-spin").removeAttr("disabled");

    // Отрисовываем канвас с картинками который плавно появляется
    drawFortuneWheel(true)
    $("#wheel-canvas-images").css({
        "transition-duration": "1s",
        "opacity": "1"
    })
})

// Начать вращение
$(".wheel__buttons").on("click tap", "#wheel-spin", () => {
    const gift = randomNumber(0, gifts.length - 1) // Выигранный подарок
    const giftDeg = 360 / gifts.length // Ширина сектора с подарком
    const marginDeg = randomNumber(-((giftDeg - 2) / 2), ((giftDeg - 2) / 2)) // Отступ от краев сектора
    const numberOfSpins = 8 // Количество вращений перед выпадением приза
    const rotationDuration = 6 // Длительность вращения (в секундах)

    // $(".wheel__buttons").hide(500, () => $(".wheel__buttons").remove())
    $(".wheel__buttons").remove()

    // Вращение колеса
    // Несколько полных оборотов + градусы для поворота на награду + дополнительное вращение для неточного наведения
    $("#wheel-canvas-images").css({
        "transition": `${rotationDuration}s all cubic-bezier(0.1, 0, 0.25, 1)`,
        "transform": `rotate(-${(numberOfSpins * 360) + (giftDeg * gift) + marginDeg}deg)`
    })

    // Через 1 секунду после остановки показываем модальное окно
    setTimeout(() => {
        // $(".wheel__modal-title").text("Ваш приз")
        // $(".wheel__modal-text").text(`${gifts[gift].title}\n\n${gifts[gift].data}`)
        // $(".wheel__modal").show()

        $(".wheel-win").text(`Ваш приз: ${gifts[gift].title}\n\n${gifts[gift].data}`).show()

    }, (rotationDuration + 1) * 1000)

})

// Список призов
// $("#show-gifts").on("click tap", () => {
//     $(".modal__content").empty().append(`
//         <h2>Все призы</h2>
//     `) 

//     // Показываем задний фон модального окна, а потом само окно
//     $(".modal").show(0, () => $(".modal__container").show(500))
// })
