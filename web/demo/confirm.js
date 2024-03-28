// Функция отображения ошибки
function setConfirmFormError(text) {
    $(".registration__confirm-error").text(text).show()
    $("#confirm-submit").attr("disabled", true)
    $("#confirm-submit").html("Подождите")
    setTimeout(() => {
        $("#confirm-submit").removeAttr("disabled")
        $("#confirm-submit").html("Подтвердить почту")
    }, 2000)
}

let time = 60 // Таймер в 60 секунд

// Запускаем таймер в одну минуту для повторной отправки кода
function startCodeTimer() {
    console.log("startCodeTimer()");
    // Обновляем текст
    $(".registration__confirm-code").css({cursor: "not-allowed"})
    $(".registration__confirm-code").text(`Отправить повторно через ${time} сек.`)

    const intervalId = setInterval(() => {
        time--

        // Если время вышло, останавливаем таймер и даем нажать
        if (time === -1) {
            clearInterval(intervalId)
            $(".registration__confirm-code").css({cursor: "pointer"})
            $(".registration__confirm-code").text("Отправить код повторно")
            return
        }

        // Обновляем текст
        $(".registration__confirm-code").text(`Отправить повторно через ${time} сек.`)
    }, 1000)
}


// Отправить код повторно
$(".registration__confirm-code").on("click tap", () => {
    console.log(time);
    // Если время в таймере не вышло, то не отправляем
    if (time !== -1) return

    // Заново запускаем таймер через 2 секунды
    time = 60 // Обновляем время
    setTimeout(startCodeTimer, 2000)
})

// Маска ввода кода (только цифры), После ввода кода автоматически отправка
const codeMask = IMask($("#form-code")[0], {mask: "000000"})
codeMask.on("complete", () => $(".registration__confirm").trigger("submit"))

// Автоматические скрытие ошибки при обновлении инпута
$(".registration__confirm input").on("input", () => {
    $(".registration__confirm-error").hide()
})

// Подтверждение кода
$(".registration__confirm").submit((event) => {
    event.preventDefault() // Отключение базового перехода
    $(".registration__confirm-error").hide() // Прячем ошибку
    
    const formCode = codeMask.unmaskedValue // Получаем код из формы

    // Проверяем код, является ли он числом или он длинной в 6 символов
    let reCode = /^-?\d+$/
    if (!reCode.test(formCode) || formCode.length !== 6) {
        setConfirmFormError("Некорректный код!")
        return
    }

    // Если все проверки прошло - отключаем кнопку и ждем ответа от сервера
    $("#confirm-submit").attr("disabled", true)
    $("#confirm-submit").html("Подождите")

    console.log({
        email: localStorage.userEmail,
        confirmation_code: formCode
    });

    // Сохраняем код от почты
    localStorage.userCode = formCode

    // Показываем последнюю страницу регистрации и разблокируем кнопку вращения колеса
    $(".registration__form-wrapper").hide() // Скрываем мобильное окно регистрации
    $("body").removeClass("phone-no-scroll") // Убираем отключение прокрутки
    $("#open-phone-registration").hide() // Скрываем мобильную кнопку "Зарегистрироваться"
    $(".registration__confirm").hide() // Скрываем блок с подтверждением почты

    $(".registration__done").show() // Показываем блок об успешной регистрации
    $("#wheel-spin").removeAttr("disabled") // Разблокируем кнопку вращения колеса
})