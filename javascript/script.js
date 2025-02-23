window.addEventListener("load", function () {
    configurarFormularioLogin();

    function configurarFormularioLogin() {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("input-user").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                exibirAlerta("Usuário e senha são obrigatórios!");
                return;
            }

            await validarCredenciais(username, password);
        });
    }

    async function obterDadosPlanilha() {
        try {
            // Buscar o JSON com o link da planilha
            const response = await fetch("../javascript/keys.json");
            if (!response.ok) throw new Error("Erro ao carregar arquivo keys.json");

            const data = await response.json();
            if (!data.length || !data[0].base) throw new Error("Formato inválido do JSON.");

            const planilhaURL = data[0].base;

            // Buscar os dados da planilha (CSV)
            const planilhaResponse = await fetch(planilhaURL);
            if (!planilhaResponse.ok) throw new Error("Erro ao carregar a planilha.");

            const csvText = await planilhaResponse.text();
            return processarCSV(csvText);
        } catch (error) {
            console.error("Erro:", error);
            exibirAlerta("Erro ao carregar dados.");
            return [];
        }
    }

    async function validarCredenciais(username, password) {
        const usuarios = await obterDadosPlanilha();
        const user = usuarios.find(u => u.user === username && u.password === password && u.status === "Liberado");

        if (user) {
            realizarLogin(user);
        } else {
            exibirAlerta("Usuário ou senha incorretos!");
        }
    }

    function processarCSV(csvText) {
        const linhas = csvText.split("\n").map(l => l.trim()).filter(l => l);
        const cabecalho = linhas[0].split(",").map(h => h.trim());

        return linhas.slice(1).map(linha => {
            const valores = linha.split(",").map(v => v.trim());
            let obj = {};
            cabecalho.forEach((chave, index) => {
                obj[chave] = valores[index] || "";
            });
            return obj;
        });
    }

    function exibirAlerta(mensagem) {
        const alert = document.getElementById("alert");
        alert.innerText = mensagem;
        alert.style.display = "block";
    }

    function realizarLogin(userData) {

        sessionStorage.setItem("logon", "1");
        sessionStorage.setItem("currentUser", userData.user);
        atualizarInterface(userData);
    }

    function atualizarInterface(userData) {
        const iframe = document.getElementById("iframe");
        iframe.src = userData.link;

        document.getElementById("container-login").classList.add("desapear");
        document.getElementById("logged-message").innerHTML = `Logado como ${userData.nickname}`;
    }
});

function Exit() {

    sessionStorage.removeItem("logon");
    sessionStorage.removeItem("currentUser");

    document.getElementById("container-login").classList.remove("desapear");
    document.getElementById("iframe").src = "";
    document.getElementById("logged-message").innerHTML = "";
    window.location.reload();
}
