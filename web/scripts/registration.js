$("#open-phone-registration").on("click tap", () => {
    $(".registration__form-wrapper").addClass("open")
    $("body").addClass("phone-no-scroll")
})

$("#close-phone-registration").on("click tap", () => {
    $(".registration__form-wrapper").removeClass("open")
    $("body").removeClass("phone-no-scroll")
})


$(".registration__form").on("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку
    $("#registration-submit").attr("disabled", true)

    // Получаем поля из фомы
    const formData = new FormData(document.querySelector(".registration__form"))
    const formName = formData.get("name")
    const formPhone = formData.get("phone")
    const formEmail = formData.get("email")

    console.log(formName)
    console.log(formPhone)
    console.log(formEmail)

    $("#wheel-spin").removeAttr("disabled")

    $(".confirm-section").show();
})