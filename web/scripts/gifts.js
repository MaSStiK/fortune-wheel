let gifts = [
    {   
        name: "Промокод на 1 мини-курс ProductStar на выбор",
        data: "Скидка: DISCOUNT65\nДействие промокода до 30.04",
        color: "#A2FF76",
        image_url: "./web/assets/gifts/1.png",
    },
    {   
        name: "Скидка на покупку любого курса - 75%",
        data: "Скидка: DISCOUNT75\nДействие промокода до 30.04",
        color: "#BBFF75",
        image_url: "./web/assets/gifts/2.png",
    },
    {   
        name: "Скидка на покупку любого курса - 70%",
        data: "Ссылка: LINK",
        color: "#CFFF74",
        image_url: "./web/assets/gifts/3.png",
    },
    {
        name: "Промокод на 2 мини-курса ProductStar на выбор",
        data: "Промокод: FREE2\nДействие промокода до 30.04",
        color: "#DDFF73",
        image_url: "./web/assets/gifts/4.png",
    },
    {
        name: "«Подписка РБК Pro» на 1 месяц",
        data: "Промокод: RBK_PRO1\nДействие промокода до 30.04",
        color: "#C2EEA3",
        image_url: "./web/assets/gifts/5.png",
    },
    {
        name: "Скидка на покупку любого курса - 65%",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        color: "#B0E9B1",
        image_url: "./web/assets/gifts/6.png",
    },
    {
        name: "Бесплатная карьерно-коучинговая консультация",
        data: "Консультация\nДействие промокода до 30.04",
        color: "#8ADFD2",
        image_url: "./web/assets/gifts/7.png",
    },
    {
        name: "Гайд “Как не создать очередной бесполезный продукт” ",
        data: "Скидка: DISCOUNT60\nДействие промокода до 30.04",
        color: "#63D4F3",
        image_url: "./web/assets/gifts/8.png",
    }
]

// Рендер призов
for (let gift of gifts) {
    $(".gifts__container").append(`
        <div class="gifts__gift">
            <img class="gifts__gift-image" src="${gift.image_url}" alt="gift">
            <p class="gifts__gift-text">${gift.name}</p>
        </div>
    `)
}