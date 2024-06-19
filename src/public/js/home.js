const socket = io()

let user;
let role;
const open = () => {
    fetch("http://localhost:3030/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            console.log(response)
            if (!response.ok) {
                throw new Error("Hubo un problema al obtener los datos.");
            }
            return response.json();
        })
        .then((data) => {
            user =`${data.succes.first_name} ${data.succes.last_name}`
            role = data.succes.role
            console.log(data)
            socket.emit("auth", user)
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });



}

open()
const input = document.getElementById("chatbox")
const log = document.getElementById("log")


input.addEventListener("keyup", e => {
    
    if (e.key === "Enter") {
        if(role === "Admin") return console.log("Lo sentimos! Al ser admin no puedes enviar mensajes")
        socket.emit("message", { user: user, message: input.value })
    }

})


socket.on("messageLogs", data => {

    let messages = ""
    console.log(data)
    data.forEach(msg => {
        messages += `${msg.user} dice ${msg.message}</br>`
    })

    log.innerHTML = messages
})