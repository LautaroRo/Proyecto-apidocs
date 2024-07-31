const buttons = document.querySelectorAll("button")
const input = document.getElementById("input")

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        const valueInput = parseInt(input.value);
        const idProduct = button.id;

        fetch("/cart", {
            method: "POST",
            body: JSON.stringify({ idProduct, valueInput }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            console.log('Response status:', response.status);
            if (response.status === 200) {
                window.location.href = "http://localhost:3030/renderCart";
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    });
});
