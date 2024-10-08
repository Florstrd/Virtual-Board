async function logIn(user, password) {
    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: user,
            password: password
        })
    });
    const respData = await response.json();
            console.log(respData);
            
            if (respData.jwt) {
                localStorage.setItem("jwt", respData.jwt);
                console.log("Logged in")
            }
            
}

document.querySelector('#btn-login').addEventListener('click', () => {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    logIn(user, password);
});