// Начать вращение
$("#wheel-spin").on("click tap", () => {
    const gift = randomNumber(0, gifts.length - 1) // Выигранный подарок
    const giftDeg = 360 / gifts.length // Радиус одного подарка
    const randomDeg = randomNumber(-giftDeg-2, giftDeg-2) // Отступ от краев сектора

    $("#wheel-spin").attr("disabled", true); // Отключаем кнопку
    sessionStorage.doWheelSpin = true

    $(".wheel__buttons").hide(500, () => $(".wheel__buttons").remove());

    // Вращаем колесо (Градусы для поворота на награду + дополнительное вращение для неточного наведения)
    Wheel.animation.stopAngle = (giftDeg * gift) + randomDeg;
    Wheel.startAnimation();
})

// Список призов
$("#wheel-gifts").on("click tap", () => {
    $(".modal__content").empty().append(`
        <h2>Все призы</h2>
    `) 

    // Показываем задний фон модального окна, а потом само окно
    $(".modal").show(0, () => $(".modal__container").show(500));
})