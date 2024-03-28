// Случайное число
function randomNumber(min, max) { 
    return Math.round(Math.random() * (max - min)) + min
}

// Кнопка вращения колеса
$("#wheel-spin").on("click tap", () => {
    // Функция вращения колеса
    $.ajax({
        url: "http://127.0.0.1:5000/spin",
        method: "POST",
        data: {
            email: localStorage.userEmail,
            confirmation_code: localStorage.userCode
        },

        success: (data) => {
            console.log("/spin >>> success")
            console.log(data);

            // Если ошибка
            if (!data.success) {
                return
            }

            spinFortuneWheel(
                data.spin_section.toString()[0],
                data.spin_result
            )
        },
    })
})

function spinFortuneWheel(giftId, giftName) {
    const numberOfSpins = 8 // Количество вращений перед выпадением приза
    const rotationDuration = 6 // Длительность вращения (в секундах)

    // Скрываем кнопки "Крутить" и "Призы"
    $(".wheel__buttons").css({"opacity": "0"})
    
    $(".wheel-section").addClass("spin") // Ставим больше отступ снизу колеса
    $("body").addClass("no-scroll") // Отключаем прокрутку страницы
    $("#wheel").get(0).scrollIntoView({behavior: 'smooth'})  // Фиксируем экран на колесе

    // Отключаем медленное вращение
    clearInterval(wheelRotationIntervalId)

    const gift = parseInt(giftId) - 1 // Номер секции выигранного подарка
    const giftDeg = 360 / gifts.length // Ширина сектора с подарком
    const selectedGiftDeg = gift * giftDeg // Градусы поворота на выбранный подарок
    const numberOfSpinsDeg = numberOfSpins * 360 // Градусы для поворота всего колеса несколько раз
    const marginDeg = randomNumber(-((giftDeg - 2) / 2), ((giftDeg - 2) / 2)) // Отступ от краев сектора
    const rotationCompensation = wheelRotationDeg % 360 // Компенсация для отсчета градусов с нуля

    // Изначальный поворот
    // - Компенсация
    // + Несколько полных оборотов
    // + Градусы для поворота на награду
    // + Дополнительное вращение для неточного наведения
    const rotateDeg = wheelRotationDeg - rotationCompensation + numberOfSpinsDeg + selectedGiftDeg + marginDeg

    // Вращение колеса
    $("#wheel-canvas").css({
        "transform": `rotate(-${rotateDeg}deg)`,
        "transition": `transform ${rotationDuration}s cubic-bezier(0.1, 0, 0.25, 1)`,
    })

    // Через 1 секунду после остановки прокрутка до секции с призом
    setTimeout(() => {
        // Заменяем текст на название приза
        $(".win__gift-name").text(giftName)

        // Отображаем секции ниже
        showGift()
    }, (rotationDuration + 1) * 1000)
}


// Функция прокрутки и отображения секций с призом и курсов
function showGift() {
    // Отображаем секцию с призом
    $("#win").css({"display": "block",})
    setTimeout(() => $("#win").css({"opacity": "1"}), 10)

    // Отображаем секцию с курсами
    $("#catalog").css({"display": "block",})
    setTimeout(() => $("#catalog").css({"opacity": "1"}), 10)

    $(".wheel__buttons").remove() // Удаляем кнопки под колесом
    $("#win").get(0).scrollIntoView({behavior: 'smooth'}) // Прокручиваем до секции с призом
    $("body").removeClass("no-scroll") // Возвращаем прокрутку страницы
}