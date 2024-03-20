let gifts = [
    {
        color: "#A2FF76",
        title: "Скидка на покупку любого курса - 65%",
        data: "Скидка: DISCOUNT65\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/1.png",
    },
    {   
        color: "#BBFF75",
        title: "Скидка на покупку любого курса - 75%",
        data: "Скидка: DISCOUNT75\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/2.png",
    },
    {
        color: "#CFFF74",
        title: "Гайд “Как не создать очередной бесполезный продукт” ",
        data: "Ссылка: LINK",
        imagePath: "./web/assets/gifts/3.png",
    },
    {
        color: "#DDFF73",
        title: "Промокод на 2 мини-курса ProductStar на выбор",
        data: "Промокод: FREE2\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/4.png",
    },
    {
        color: "#C2EEA3",
        title: "«Подписка РБК Pro» на 1 месяц",
        data: "Промокод: RBK_PRO1\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/5.png",
    },
    {
        color: "#B0E9B1",
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/6.png",
    },
    {
        color: "#8ADFD2",
        // title: "Бесплатная консультация от Карьерного Центра ProductStar",
        title: "Бесплатная карьерно-коучинговая консультация",
        data: "Консультация\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/7.png",
    },
    {
        color: "#63D4F3",
        title: "Скидка на покупку любого курса - 60%",
        data: "Скидка: DISCOUNT60\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/8.png",
    },
]

// Рендер призов
for (let gift of gifts) {
    $(".gifts__container").append(`
        <div class="gifts__gift">
            <img class="gifts__gift-image" src="${gift.imagePath}" alt="gift">
            <p class="gifts__gift-text">${gift.title}</p>
        </div>
    `)
}