document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário
    
    // Pega os valores do input
    const username = document.getElementById('input-user').value;
    const password = document.getElementById('password').value;
    

    fetch('keys.json')
        .then(Response => Response.json())
        .then(data => {
    
            const validUsername = data.user;
            const validPassword = data.password;

            if (username === validUsername && password === validPassword) {

                const messagelogged = document.getElementById('logged-message');
                const logado = document.getElementById('container-login');
                const iframe = document.getElementById('iframe');

                iframe.src = data.link;

                logado.classList.add('desapear');

                messagelogged.innerHTML = `Bem Vindo ${username}`
                
            } else {
                document.getElementById('alert').innerText = "Usuário ou senha incorretos!";
            }})
    });
