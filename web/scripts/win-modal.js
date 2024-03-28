// Маска ввода номера телефона в модальном окне
const consultationPhoneMask = IMask($("#consultation-phone")[0], {mask: "+0(000)000-00-00"})

// Отобразить модальное окно "Карьерный консультант"
$("#win-open-modal").on("click tap", () => {
    $("body").addClass("no-scroll") // Отключаем прокрутку
    $(".win-modal__wrapper").addClass("show") // Показываем модальное окно

    // Если поля пустые, то заполняем их
    if (!$("#consultation-name").val() && !$("#consultation-phone").val() && !$("#consultation-email").val()) {
        $("#consultation-name").val(localStorage.userName)
        consultationPhoneMask.value = localStorage.userPhone
        $("#consultation-email").val(localStorage.userEmail)
    }
})

// Скрыть модальное окно "Карьерный консультант"
$("#win-close-modal").on("click tap", () => {
    $("body").removeClass("no-scroll") // Включаем прокрутку
    $(".win-modal__wrapper").removeClass("show") // Скрываем модальное окно
})