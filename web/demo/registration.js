// Функция отображения ошибки
function setFormError(text) {
    $(".registration__form-error").text(text).show()
    $("#registration-submit").attr("disabled", true)
    $("#registration-submit").html("Подождите")
    setTimeout(() => {
        $("#registration-submit").removeAttr("disabled")
        $("#registration-submit").html("Отправить")
    }, 5000)
}


// Маска ввода номера телефона
const phoneMask = IMask($("#form-phone")[0], {mask: "+0(000)000-00-00"})

// Поле name, удаление лишних пробелов
$("#form-name").on("change", () => {
    $("#form-name").val($("#form-name").val().replace(/ +/g, " ").trim())
})

// Поле email, удаление всех пробелов
$("#form-email").on("change", () => {
    $("#form-email").val($("#form-email").val().replaceAll(" ", "").trim())
})

// Автоматические скрытие ошибки при обновлении инпутов
$(".registration__form input").on("input", () => {
    $(".registration__form-error").hide()
})

$(".registration__form").submit((event) => {
    event.preventDefault() // Отключение базового перехода
    $(".registration__form-error").hide() // Прячем ошибку
    
    // Получаем поля из фомы
    const formData = new FormData($(".registration__form")[0])
    const formName = formData.get("name").trim()
    const formPhone = phoneMask.unmaskedValue.trim()
    const formEmail = formData.get("email").trim()
    const formPolicy = formData.get("policy")

    // Если поле имя не заполнено
    if (!formName.length) {
        setFormError("Вы не заполнили поле имя!")
        return
    }
    // Проверка максимальной длины имени
    if (formName.length > 100) {
        setFormError("Длина имени не может превышать 100 символов!")
        return
    }

    // Проверка поля Номер телефона на регулярном выражении (является ли значение числом) или не равен 11 символам
    let rePhone = /^-?\d+$/
    if (!rePhone.test(formPhone) || formPhone.length !== 11) {
        setFormError("Неверный формат номера телефона!")
        return
    }

    // Проверка поля Почты на регулярном выражении
    let reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i
    if (!reEmail.test(formEmail)) {
        setFormError("Неверный формат email!")
        return
    }

    // Если поле почты не заполнено
    if (!formEmail.length) {
        setFormError("Вы не заполнили поле email!")
        return
    }

    // Проверка максимальной длины почты
    if (formEmail.length > 100) {
        setFormError("Длина email не может превышать 100 символов!")
        return
    }

    // Проверка галочки политики конфиденциальности
    if (!formPolicy) {
        setFormError("Вы не поставили галочку!")
        return
    }


    // Если все проверки прошло - отключаем кнопку и ждем ответа от сервера
    $("#registration-submit").attr("disabled", true)
    $("#registration-submit").html("Подождите")

    // Сохраняем информацию
    localStorage.userName = formName
    localStorage.userPhone = "+" + formPhone,
    localStorage.userEmail = formEmail

    console.log({
        user_name: formName,
        email: formEmail,
        phone: "+" + formPhone,
    },);


    $(".registration__form").hide()
    $(".registration__confirm").show()
    setTimeout(startCodeTimer, 2000) // Через 2 секунды запускаем таймер
})



// Телефонная кнопка открытия регистрации
$("#open-phone-registration").on("click tap", () => {
    $(".registration__form-wrapper").show()
    $("body").addClass("phone-no-scroll")
})

// Телефонная кнопка отмены регистрации
$("#close-phone-registration").on("click tap", () => {
    $(".registration__form-wrapper").hide()
    $("body").removeClass("phone-no-scroll")
})