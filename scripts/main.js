function randomNumber(min, max) { // Случайное число
    return Math.round(Math.random() * (max - min)) + min;
}

const rewards = [
    {
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        titlePhone: "Промокод на 1 мини-курс",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        tooltip: "Промокод на 1 мини-курс ProductStar на выбор",
    },
    {
        title: "Промокод на 2 мини-курса ProductStar на выбор",
        titlePhone: "Промокод на 2 мини-курса",
        data: "Промокод: FREE2\nДействие промокода до 30.04",
        tooltip: "Промокод на 2 мини-курса ProductStar на выбор",
    },
    {
        title: "Гайд “Как не создать очередной бесполезный продукт” ",
        titlePhone: "Гайд",
        data: "Ссылка: LINK",
        tooltip: "Гайд “Как не создать очередной бесполезный продукт” ",
    },
    {
        title: "Скидка на покупку любого курса - 65%",
        titlePhone: "Скидка 65%",
        data: "Скидка: DISCOUNT65\nДействие промокода до 30.04",
        tooltip: "Скидка на покупку любого курса - 65%",
    },
    {
        title: "Скидка на покупку любого курса - 70%",
        titlePhone: "Скидка 70%",
        data: "Скидка: DISCOUNT70\nДействие промокода до 30.04",
        tooltip: "Скидка на покупку любого курса - 70%",
    },
    {
        title: "Скидка на покупку любого курса - 75%",
        titlePhone: "Скидка 75%",
        data: "Скидка: DISCOUNT75\nДействие промокода до 30.04",
        tooltip: "Скидка на покупку любого курса - 75%",
    },
    {
        title: "Бесплатная консультация от Карьерного Центра ProductStar",
        titlePhone: "Бесплатная консультация",
        data: "Консультация\nДействие промокода до 30.04",
        tooltip: "Бесплатная консультация от Карьерного Центра ProductStar",
    },
    {
        title: "«Подписка РБК Pro» на 1 месяц",
        titlePhone: "Подписка РБК Pro",
        data: "Промокод: RBK_PRO1\nДействие промокода до 30.04",
        tooltip: "«Подписка РБК Pro» на 1 месяц",
    },
]

// Отображаем все награды
for (let reward of rewards) {
    $(".wheel__container").append(`
        <div data-tooltip="${reward.tooltip}">
            <p>${reward.title}</p>
            <p>${reward.titlePhone}</p>
        </div>
    `)
}

// Вращение колеса
function spinWheel() {
    sessionStorage.doWheelSpin = true // Устанавливаем что колесо вращается
    $(".wheel__container-tooltip").removeClass("show"); // Скрываем подсказку

    const reward = randomNumber(0, rewards.length - 1) // Выигранный подарок
    const randomRotation = randomNumber(2, 5) // Количество вращений
    const randomDeg = randomNumber(-20, 20) // Отступ от краев сектора

    $("#wheel-button").attr("disabled", true); // Отключаем кнопку

    // Вращаем колесо (Градусы для поворота на награду + количество вращений + дополнительное вращение для неточного наведения)
    $(".wheel__container").css({
        "transition": "5s all cubic-bezier(0.76, 0, 0.24, 1)",
        "transform": `rotate(-${(45 * reward) + (360 * randomRotation) + randomDeg}deg)`
    })

    // Через 6 секунд показываем модальное окно
    setTimeout(() => {
        $(".modal__content").empty().append(`
            <h2>Вы выиграли</h2>
            <p>${rewards[reward].title}</p>
            <p>${rewards[reward].data}</p>
        `)

        $(".modal").addClass("show");
    }, 6000)
}

// Кнопка начинающая вращение
$("#wheel-button").on("click tap", spinWheel)

// Подсказка при наведении на пк
$(".wheel__container").mousemove((event) => {
    if (!device.desktop()) return

    const tooltip = $(event.target).attr("data-tooltip")
    if (tooltip && !sessionStorage.doWheelSpin) { // Если есть подсказка и колесо не крутится
        $(".wheel__container-tooltip p").text(tooltip)
        $(".wheel__container-tooltip").css({
            "left": `${event.pageX + 10}px`,
            "top": `${event.pageY + 10}px`
        })
        // $(".wheel__container-tooltip").css({"left": `${event.pageX+10}px`, "top": `${event.pageY+10}px`})

        $(".wheel__container-tooltip").addClass("show");
    } else { // Если нету подсказки - скрываем
        $(".wheel__container-tooltip").removeClass("show");
    }
})

// Если вышли за пределы колеса - скрываем
$(".wheel__container").mouseleave(() => {
    $(".wheel__container-tooltip").removeClass("show");
})


// Подсказка при клике на мобильном устройстве
$(".wheel__container").on("click tap", (event) => {
    if (!device.mobile()) return

    const tooltip = $(event.target).attr("data-tooltip")
    if (tooltip && !sessionStorage.doWheelSpin) { // Если есть подсказка, ширина телефона и колесо не крутится
        $(".modal__content").empty().append(`
            <p>${tooltip}</p>
        `)
        $(".modal").addClass("show");
    }
})