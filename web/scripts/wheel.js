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
        title: "Бесплатная консультация от Карьерного Центра ProductStar",
        data: "Консультация\nДействие промокода до 30.04",
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
        title: "«Подписка РБК Pro» на 1 месяц",
        data: "Промокод: RBK_PRO1\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/7.png",
    },
    {
        color: "#63D4F3",
        title: "Скидка на покупку любого курса - 60%",
        data: "Скидка: DISCOUNT60\nДействие промокода до 30.04",
        imagePath: "./web/assets/gifts/8.png",
    },
]




// Отрисовки колеса
function drawFortuneWheel(drawImages=false) {
    const canvas = document.getElementById(drawImages ? "wheel-canvas-images" : "wheel-canvas")
    
    // Канвас большого размера что бы картинки не мылились
    canvas.setAttribute("width", 1280)
    canvas.setAttribute("height", 1280) 

    if (canvas.getContext) {
        const arc = Math.PI / (gifts.length / 2)

        const outsideRadius = canvas.width / 2 // Радиус окружности
        const imageRadius = outsideRadius / 1.4 // Отдаленность картинок от центра окружности
        const imageSize = gifts[0].image.naturalWidth * 1.9 // Размер картинки
        // Размер картинки можно сделать меньше если они станут не влезать
        // (все картинки должны быть одного размера)

        let ctx = canvas.getContext("2d")
        ctx.clearRect(0,0,canvas.width,canvas.height)
        $("#wheel-canvas-images").css({
            "transition-duration": "1s",
        })

        for (let i in gifts) {
            // Начальный поворот - минус 90 градусов и минус половина ширины 
            const angle = (i * arc) - (90 * (Math.PI / 180)) - (arc / 2) 

            ctx.beginPath()
            ctx.arc(outsideRadius, outsideRadius, outsideRadius, angle, angle + arc, false)
            ctx.arc(outsideRadius, outsideRadius, 0, angle + arc, angle, true)
            ctx.fillStyle = gifts[i].color
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(outsideRadius, outsideRadius)
            ctx.arc(outsideRadius, outsideRadius, outsideRadius, angle, angle + arc)
            ctx.lineTo(outsideRadius, outsideRadius)
            ctx.fillStyle = gifts[i].color
            ctx.fill()
            // Отрисовываем двумя способами что бы избавится от линий между секциями
            
            // Если нужно отрисовать изображения
            if (drawImages) {
                ctx.save()
                ctx.translate(
                    outsideRadius + Math.cos(angle + arc / 2) * imageRadius, 
                    outsideRadius + Math.sin(angle + arc / 2) * imageRadius
                )
                ctx.rotate(angle + arc / 2 + Math.PI / 2)

                ctx.imageSmoothingEnabled = true
                ctx.drawImage(gifts[i].image, -imageSize / 2, 0, imageSize, imageSize) // Отрисовываем изображение
                ctx.restore()
            }
        } 
    }
}



// Загружаем картинки
let loadImagesCount = 0 // Количество загруженных картинок
for (let gift in gifts) { 
    let image = new Image()
    image.src = gifts[gift].imagePath
    
    gifts[gift].image = image // Сохраняем загруженную картинку
    
    loadImagesCount++
    image.onload = () => loadImagesCount--
}

// Ждем пока все картинки загрузятся, после чего отрисовываем колесо
const intervalId = setInterval(() => {  
    if (loadImagesCount === 0) {
        clearInterval(intervalId)

        // drawFortuneWheel()


        // Отрисовываем канвас с картинками который плавно появляется
        drawFortuneWheel(true)
        $("#wheel-canvas-images").css({
            "transition-duration": "1s",
            "opacity": "1"
        })
    }
}, 10)