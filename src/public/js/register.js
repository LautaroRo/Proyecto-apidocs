const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => (obj[key] = value));

    fetch("/api/sessions/register", {
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
            window.location.replace("/login");
        } else {
            console.log("algo salio mal");
        }
    })
});
