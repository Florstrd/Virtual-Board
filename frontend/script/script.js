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
                console.log("Logged in");
                ws();
            }
            
}

function ws() {
WS_TOKEN = localStorage.getItem('jwt');
const socket = new WebSocket(`ws://localhost:5000?token=${WS_TOKEN}`);
    
    
socket.onopen = function (event) {
    console.log('Connected to WebSocket server');
};

socket.onmessage = function (event) {
    console.log('Received message:', event.data);
    const data = JSON.parse(event.data);
    if (data.status == 0) {
        document.querySelector('#out').innerHTML = data.msg;
        document.querySelector('#err').innerHTML = '';
    } else {
        document.querySelector('#err').innerHTML = data.msg;
    }
    
};

document.querySelector('#in').addEventListener('input', (evt) => {
    socket.send(evt.target.value);
});

socket.onclose = function (event) {
    console.log('Connection closed');
};
}

document.querySelector('#btn-login').addEventListener('click', () => {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    logIn(user, password);
});