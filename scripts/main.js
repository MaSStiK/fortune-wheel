function randomNumber(min, max) { // Случайное число
    return Math.round(Math.random() * (max - min)) + min;
}

const rewards = [
    {
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        titlePhone: "Промокод на 1 мини-курс",
    },
    {
        title: "Промокод на 2 мини-курса ProductStar на выбор",
        titlePhone: "Промокод на 2 мини-курса",
    },
    {
        title: "Гайд “Как не создать очередной бесполезный продукт” ",
        titlePhone: "Гайд",
    },
    {
        title: "Скидка на покупку любого курса - 65%",
        titlePhone: "Скидка 65%",
    },
    {
        title: "Скидка на покупку любого курса - 70%",
        titlePhone: "Скидка 70%",
    },
    {
        title: "Скидка на покупку любого курса - 75%",
        titlePhone: "Скидка 75%",
    },
    {
        title: "Бесплатная консультация от Карьерного Центра ProductStar",
        titlePhone: "Бесплатная консультация",
    },
    {
        title: "«Подписка РБК Pro» на 1 месяц",
        titlePhone: "«Подписка РБК Pro» на 1 месяц",
    },
]

// Отображаем все награды
for (let reward of rewards) {
    $(".wheel__container").append(`
        <div>
            <p>${reward.title}</p>
            <p>${reward.titlePhone}</p>
        </div>
    `)
}


// Вращение колеса
function spinWheel() {
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
        $("#modal-prize").text(rewards[reward].title);
        $(".modal").removeClass("hidden");
    }, 6000)
}

// Кнопка начинающая вращение
$("#wheel-button").on("click tap", spinWheel)