window.addEventListener("load", function () {
    const logon = localStorage.getItem("logon");

    if (logon === "1") {
        entrarDireto();
    } else {
        configurarFormularioLogin();
    }

    function configurarFormularioLogin() {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("input-user").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                exibirAlerta("Usuário e senha são obrigatórios!");
                return;
            }

            validarCredenciais(username, password);
        });
    }

    function validarCredenciais(username, password) {
        fetch("../javascript/keys.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar arquivo keys.json");
                }
                return response.json();
            })
            .then(data => {
                const user = data.find(u => u.user === username && u.password === password);
                if (user) {
                    realizarLogin(user);
                } else {
                    exibirAlerta("Usuário ou senha incorretos!");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar o arquivo keys.json:", error);
                exibirAlerta("Erro ao carregar dados de login.");
            });
    }

    function exibirAlerta(mensagem) {
        const alert = document.getElementById("alert");
        alert.innerText = mensagem;
        alert.style.display = "block";
    }

    function realizarLogin(userData) {
        localStorage.setItem("logon", "1");
        localStorage.setItem("currentUser", userData.user);
        atualizarInterface(userData);
    }
    

    function entrarDireto() {
        const currentUser = localStorage.getItem("currentUser");
    
        if (!currentUser) {
            exibirAlerta("Erro: Usuário atual não encontrado no armazenamento local.");
            return;
        }
    
        fetch("../javascript/keys.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar arquivo keys.json");
                }
                return response.json();
            })
            .then(data => {
                const usuarioAtual = data.find(u => u.user === currentUser);
                if (usuarioAtual) {
                    atualizarInterface(usuarioAtual);
                } else {
                    exibirAlerta("Erro: Usuário não encontrado no arquivo keys.json.");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar o arquivo keys.json:", error);
                exibirAlerta("Erro ao carregar dados para login direto.");
            });
    }
    

    function atualizarInterface(userData) {
        const iframe = document.getElementById("iframe");
        iframe.src = userData.link;

        document.getElementById("container-login").classList.add("desapear");
        document.getElementById("logged-message").innerHTML = `Logado como ${userData.nickname}`;
    }
});


function Exit() {
    localStorage.removeItem("logon");
    document.getElementById("container-login").classList.remove("desapear");
    document.getElementById("iframe").src = "";
    document.getElementById("logged-message").innerHTML = "";
    window.location.reload()
}
