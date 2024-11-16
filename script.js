window.addEventListener("load", function() {
    let logon = localStorage.getItem('logon');

    
    if (logon === "1") {
        entrarDireto(); 
    } else {
    
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
         
            const username = document.getElementById('input-user').value;
            const password = document.getElementById('password').value;
           
        
            fetch('keys.json')
                .then(response => response.json())
                .then(data => {
                    const validUsername = data.user;
                    const validPassword = data.password;
        
                   
                    if (username === validUsername && password === validPassword) {
                        realizarLogin(data);
                    } else {
                
                        document.getElementById('alert').innerText = "Usuário ou senha incorretos!";
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar o arquivo keys.json:", error);
                    document.getElementById('alert').innerText = "Erro ao carregar dados de login.";
                });
        });
    }

    console.log("Logon status:", logon);

    
    function entrarDireto() {
        fetch('keys.json')
            .then(response => response.json())
            .then(data => {
                const iframe = document.getElementById('iframe');
                iframe.src = data.link;

                document.getElementById('container-login').classList.add('desapear');
                document.getElementById('logged-message').innerHTML = `Logado como, ${data.nickname}`;
            })
            .catch(error => console.error("Erro ao buscar o arquivo keys.json:", error));
    }


    function realizarLogin(data) {
        const iframe = document.getElementById('iframe');
        iframe.src = data.link;

        document.getElementById('container-login').classList.add('desapear');
        document.getElementById('logged-message').innerHTML = `Logado como, ${data.nickname}`;

        localStorage.setItem("logon", "1");
    }
});

function Exit() {
    localStorage.setItem('logon', "0");
    document.getElementById('container-login').classList.remove('desapear');
    document.getElementById('iframe').src = "";
    document.getElementById('logged-message').innerHTML = "";
}
