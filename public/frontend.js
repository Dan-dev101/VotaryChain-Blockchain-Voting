const publicKey = document.getElementById("public-key");
const privateKey = document.getElementById("private-key");
const generateKeyButton = document.getElementById("generate-button");
const voterInputs = document.getElementById("voting-form");



function showPassword() {
    let userInput = document.getElementById("input-priv-key");
    if (userInput.type === "password") {
        userInput.type = "text";
    } else {
        userInput.type = "password";
    }
}

generateKeyButton.addEventListener("click", function() {
        fetch("http://localhost:8080/api/generate-key", {
            method: "POST"
        })
            .then(function (res) {
                return res.json();
            }) 
            .then(function (data) {
                console.log(data)
                publicKey.innerHTML = data.publicKey;
                privateKey.innerHTML = data.privateKey;
            })
            .catch((err) => {
                console.error("Fetch failed:", err);
            });
});

    // const formData = new FormData(voterInputs);
    // const data = Object.fromEntries(formData.entries());
    // console.log(data);

voterInputs.addEventListener("submit", function(eventObj) {
    eventObj.preventDefault();

    const formData = new FormData(voterInputs);
    const data = Object.fromEntries(formData.entries());

    fetch("http://localhost:8080/api/vote", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(function (res) {
        return res.json();
    })
    .then(function(responseData) {
        console.log("Server response:", responseData);
    })
    .catch((err) => {
        console.error("Fetch failed:", err);
    });
});