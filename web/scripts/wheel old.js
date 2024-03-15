function randomNumber(min, max) { // Случайное число
    return Math.round(Math.random() * (max - min)) + min;
}

const gifts = [
    {   
        fillStyle: "#E5FF00",
        title: "Скидка на покупку любого курса - 75%",
        data: "Скидка: DISCOUNT75\nДействие промокода до 30.04",
        image: "./web/assets/gifts/1.png",
    },
    {
        fillStyle: "#A8D41D",
        title: "Скидка на покупку любого курса - 65%",
        data: "Скидка: DISCOUNT65\nДействие промокода до 30.04",
        image: "./web/assets/gifts/2.png",
    },
    {
        fillStyle: "#59BF7D",
        title: "Гайд “Как не создать очередной бесполезный продукт” ",
        data: "Ссылка: LINK",
        image: "./web/assets/gifts/3.png",
    },
    {
        fillStyle: "#5EE1FE",
        title: "Промокод на 2 мини-курса ProductStar на выбор",
        data: "Промокод: FREE2\nДействие промокода до 30.04",
        image: "./web/assets/gifts/4.png",
    },
    {
        fillStyle: "#965CFF",
        title: "Скидка на покупку любого курса - 70%",
        data: "Скидка: DISCOUNT70\nДействие промокода до 30.04",
        image: "./web/assets/gifts/5.png",
    },
    {
        fillStyle: "#D7499A",
        title: "Бесплатная консультация от Карьерного Центра ProductStar",
        data: "Консультация\nДействие промокода до 30.04",
        image: "./web/assets/gifts/6.png",
    },
    {
        fillStyle: "#FF99F5",
        title: "«Подписка РБК Pro» на 1 месяц",
        data: "Промокод: RBK_PRO1\nДействие промокода до 30.04",
        image: "./web/assets/gifts/7.png",
    },
    {
        fillStyle: "#FFE376",
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        image: "./web/assets/gifts/8.png",
    },
    {
        fillStyle: "#FFE376",
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        image: "./web/assets/gifts/3.png",
    },
    {
        fillStyle: "#FFE376",
        title: "Промокод на 1 мини-курс ProductStar на выбор",
        data: "Промокод: FREE1\nДействие промокода до 30.04",
        image: "./web/assets/gifts/3.png",
    }
]

delete sessionStorage.doWheelSpin

let segments = []
for (let gift of gifts) {
    segments.push({
        fillStyle: gift.fillStyle,
        text: gift.title,
        image: gift.image,
    })
}


const startAngle = -5 // Поворот колеса перед вращением

const Wheel = new Winwheel({
    canvasId: "wheel-canvas", // canvas id
    outerRadius: 275, // Диаметр колеса
    numSegments: gifts.length, // Количество сегментов
    centerX: 340, // Центр колеса по X
    centerY: 344, // Центр колеса по Y
    rotationAngle: startAngle, // Начальный угол вращения

    responsive: true, // Сжатие колеса 

    drawText: false, // Не отображаем текст, но он нужен для вывода подсказок
    drawMode: "segmentImage", // Режим отображения картинок

    segments: segments, // Элементы колеса

    animation : {
        type: "spinToStop",
        duration: 10, // Длительность анимации
        spins: 3, // Количество вращений
        callbackFinished : wheelEnd, // Функция которая сработает после прокрутки колеса
    }
})

// Функция которая сработает после прокрутки колеса
function wheelEnd(indicatedSegment) {
    console.log(indicatedSegment);
    const gift = gifts.find((element) => element.title === indicatedSegment.text);

    $(".modal__content").empty().append(`
        <h2>Вы выиграли</h2>
        <p>${gift.title}</p>
        <p>${gift.data}</p>
    `)

    $(".modal").show(0, () => $(".modal__container").show(500));
}



// Подсказка при наведении на пк
$("#wheel-canvas").mousemove((event) => {
    console.log(event);
    if (!device.desktop()) return // Если не пк, то не отображаем подсказку

    const segment = Wheel.getSegmentAt(event.clientX, event.clientY);

    if (segment && !sessionStorage.doWheelSpin) { // Если колесо не вращается
        $(".wheel-container__tooltip p").text(segment.text)
        $(".wheel-container__tooltip").css({
            "left": `${event.clientX + 10}px`,
            "top": `${event.clientY + 10}px`
        })

        $(".wheel-container__tooltip").show()
    } else {
        $(".wheel-container__tooltip").hide()
    }
})

// Если вышли за пределы колеса - скрываем
$("#wheel-canvas").mouseleave(() => {
    $(".wheel-container__tooltip").hide()
})

// Подсказка при клике на мобильном устройстве
$("#wheel-canvas").on("click tap", (event) => {
    // if (!device.mobile()) return // Если не телефон, то не отображаем подсказку
    const segment = Wheel.getSegmentAt(event.clientX, event.clientY);

    if (segment) {
        const gift = gifts.find((element) => element.title === segment.text);

        $(".modal__content").empty().append(`
            <p>${gift.title}</p>
        `)

        $(".modal").show(0, () => $(".modal__container").show(500));
    }
})