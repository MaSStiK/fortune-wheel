$("#go-to-wheel").on("click tap", () => {
    $(".home").hide()
    $(".wheel").show()
})

$("#go-to-registration").on("click tap", () => {
    $(".home").hide()
    $(".registration").show()
})

$("#go-to-home").on("click tap", () => {
    $(".registration").hide()
    $(".home").show()
})


$("#wheel-gifts").on("click tap", () => {
    $(".wheel").hide()
    $(".home").show()
})