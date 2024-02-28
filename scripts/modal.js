// Кнопка закрытия модального окна
$("#modal-close").on("click tap", (event) => {
    event.stopPropagation()

    // Возвращаем колесо в исходное положение
    $(".wheel__container").css({
        "transition": "0s",
        "transform": `rotate(0deg)`
    })

    $("#wheel-button").removeAttr("disabled"); // Включаем кнопку
    $(".modal").addClass("hidden");
});

// Закрываем модальное окно при клике вне него
$(document).on("click tap", (event) => {
    if ($(event.target).is('.modal')) {
        $("#modal-close").click();
    }
});