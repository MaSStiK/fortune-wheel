// Рендер призов
for (let gift of gifts) {
    $(".rules__gifts-container").append(`
        <div class="rules__gift">
            <img class="rules__gift-image" src="${gift.imagePath}" alt="gift">
            <p class="rules__gift-text">${gift.title}</p>
        </div>
    `)
}