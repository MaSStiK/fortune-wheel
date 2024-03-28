let wheelRotationDeg = 0 // Градусы поворота колеса
let wheelRotationIntervalId // id интервала медленного вращения колеса

// Отрисовка канваса с колесом
function drawCanvasFortuneWheel() {
    const canvas = $("#wheel-canvas")[0]
    if (canvas.getContext) {
        const arc = Math.PI / (gifts.length / 2)

        const outsideRadius = canvas.width / 2 // Радиус окружности
        const imageRadius = outsideRadius / 1.4 // Отдаленность картинок от центра окружности
        const imageSize = gifts[0].image.naturalWidth * 1.9 // Размер картинки
        // Размер картинки можно сделать меньше если они станут не влезать
        // (все картинки должны быть одного размера)

        let ctx = canvas.getContext("2d")
        ctx.clearRect(0,0,canvas.width,canvas.height)

        for (let gift in gifts) {
            // Начальный поворот - минус 90 градусов и минус половина ширины 
            const angle = (gift * arc) - (90 * (Math.PI / 180)) - (arc / 2) 

            ctx.beginPath()
            ctx.arc(outsideRadius, outsideRadius, outsideRadius, angle, angle + arc, false)
            ctx.arc(outsideRadius, outsideRadius, 0, angle + arc, angle, true)
            ctx.fillStyle = gifts[gift].color
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(outsideRadius, outsideRadius)
            ctx.arc(outsideRadius, outsideRadius, outsideRadius, angle, angle + arc)
            ctx.lineTo(outsideRadius, outsideRadius)
            ctx.fillStyle = gifts[gift].color
            ctx.fill()
            // Отрисовываем двумя способами что бы избавится от линий между секциями
            
            // Отрисовка изображений
            ctx.save()
            ctx.translate(
                outsideRadius + Math.cos(angle + arc / 2) * imageRadius, 
                outsideRadius + Math.sin(angle + arc / 2) * imageRadius
            )
            ctx.rotate(angle + arc / 2 + Math.PI / 2)

            ctx.imageSmoothingEnabled = true
            ctx.drawImage(gifts[gift].image, -imageSize / 2, 0, imageSize, imageSize) // Отрисовываем изображение
            ctx.restore()
        }


        // Плавное появление колеса после отрисовки
        $("#wheel-canvas").css({
            "opacity": "1"
        })

        // Медленное вращение колеса после отрисовки
        wheelRotationIntervalId = setInterval(() => {
            $("#wheel-canvas").css({
                "transform": `rotate(-${wheelRotationDeg}deg)`
            })
            wheelRotationDeg += 0.1
        }, 10)
    }
}


// Функция которая запускает рендер всего колеса
function renderFortuneWheel() {
    // Подгружаем картинки
    let loadImagesCount = 0 // Количество загруженных картинок
    for (let gift in gifts) { 
        let image = new Image()
        image.src = gifts[gift].image_url
        
        gifts[gift].image = image // Сохраняем загруженную картинку
        
        loadImagesCount++
        image.onload = () => loadImagesCount--
    }

    // Ждем пока все картинки загрузятся, после чего отрисовываем колесо
    const intervalId = setInterval(() => {  
        if (loadImagesCount === 0) {
            clearInterval(intervalId)

            // Отрисовываем канвас
            drawCanvasFortuneWheel()
        }
    }, 10)
}
