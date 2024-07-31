const buttons = document.querySelectorAll(".button")
const buttonsDelete = document.querySelectorAll(".buttonDelete")
const deleteAll = document.getElementById("eliminarTodos")
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        const obj = {
            pid: button.id,
            cid: button.dataset.cartId
        }

        fetch("/api/cart/purchase", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        })    .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((response) => {
            if (response.status === "Succes") {
                window.location.replace("/perfil");
            } else {
                console.log("algo salio mal");
            }
        })
    });
})


buttonsDelete.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        const obj = {
            pid: button.id,
            cid: button.dataset.cartId
        }

        fetch("/api/cart/deleteProducts", {
            method: "DELETE",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
    })
})

deleteAll.addEventListener("click", (e) => {
    e.preventDefault()

    fetch("/api/cart/deleteAllProduct", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        if(response.status === 200){
            return window.location.href="http://localhost:3030/perfil"
        }
    })
})