
const button = document.getElementById("buttonClose")


button.addEventListener("click", (e) => {
    e.preventDefault()
    fetch("/api/users/deleteSession", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if(response.status === 200){
            window.location.href = "/login"
        }
    })
})