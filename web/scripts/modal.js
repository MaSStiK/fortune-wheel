// Кнопка закрытия модального окна
$("#modal-close").on("click tap", (event) => {
    event.stopPropagation()

    // Если модальное окно показано после вращения колеса
    if (sessionStorage.doWheelSpin) {
        delete sessionStorage.doWheelSpin

        // Возвращаем колесо в исходное положение
        Wheel.rotationAngle = startAngle
        Wheel.draw();
        $("#wheel-spin").removeAttr("disabled") // Включаем кнопку вращения
    }
    
    // Сначала прячем контейнер, а потом задний фон
    $(".modal__container").hide(500, () => $(".modal").hide());
})

// Закрываем модальное окно при клике вне него
$(document).on("click tap", (event) => {
    if ($(event.target).is(".modal")) {
        $("#modal-close").click()
    }
})
