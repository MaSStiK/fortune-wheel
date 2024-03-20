const form = document.querySelector(".registration__form")
form.addEventListener("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку
    $("#registration-submit").attr("disabled", true);

    // Получаем поля из фомы
    const formData = new FormData(form)
    const formName = formData.get("name")
    const formPhone = formData.get("phone")
    const formEmail = formData.get("email")

    console.log(formName);
    console.log(formPhone);
    console.log(formEmail);

    $("#wheel-spin").removeAttr("disabled");
})