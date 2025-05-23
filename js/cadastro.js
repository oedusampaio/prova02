document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado. Iniciando script de cadastro.');

    // --- Referências aos elementos HTML ---
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha"); // Referência ao novo campo de senha
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const msgParagraph = document.getElementById("msg"); // Parágrafo da mensagem de sucesso
    const cardsContainer = document.getElementById("cardsContainer");
    const goToLoginBtn = document.getElementById("goToLoginBtn"); // Referência ao novo botão "Ir para o Login"

    // Referências aos botões de ação originais para ocultá-los/exibi-los
    // Usamos querySelector aqui caso os botões de cadastrar/voltar não tenham IDs específicos.
    // Se eles tiverem IDs, é mais robusto usar getElementById.
    const cadastrarButton = document.querySelector('button[onclick="cadastrarVoluntario()"]');
    const voltarButton = document.querySelector('button[onclick="voltar()"]');

    // Verifica se todos os elementos essenciais foram encontrados
    // Isso é crucial para evitar "Cannot read properties of null" errors
    if (!nomeInput || !emailInput || !senhaInput || !cepInput || !enderecoInput || !msgParagraph || !cardsContainer || !goToLoginBtn || !cadastrarButton || !voltarButton) {
        console.error("Erro fatal: Um ou mais elementos HTML essenciais não foram encontrados. Verifique os IDs/seletores no HTML e no JS.");
        alert("Erro na inicialização da página. Por favor, contate o suporte e informe este erro no console.");
        return; // Interrompe a execução do script se os elementos não forem encontrados
    } else {
        console.log("Todos os elementos HTML essenciais foram encontrados.");
    }


    // --- Adiciona Listeners de Eventos ---

    // Listener para o CEP no evento blur (ao sair do campo)
    cepInput.addEventListener("blur", buscarEndereco);

    // Listener para o novo botão "Ir para o Login"
    goToLoginBtn.addEventListener("click", () => {
        console.log("Botão 'Ir para o Login' clicado. Redirecionando...");
        window.location.href = "login.html"; // Redireciona para a tela de login
    });

    // --- Executa funções iniciais ---
    exibirCards(); // Carrega e exibe os cards ao carregar a página


    // --- Funções Auxiliares ---

    async function buscarEndereco() {
        console.log('Buscando endereço para o CEP:', cepInput.value);
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    alert("CEP inválido!");
                    enderecoInput.value = ""; // Limpa o campo de endereço
                    console.warn("CEP inválido retornado pelo ViaCEP.");
                } else {
                    const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    enderecoInput.value = enderecoCompleto;
                    console.log('Endereço encontrado:', enderecoCompleto);
                }
            } catch (error) {
                console.error("Erro ao buscar endereço via ViaCEP:", error);
                alert("Erro ao buscar endereço. Verifique sua conexão ou tente novamente.");
                enderecoInput.value = ""; // Limpa o campo de endereço em caso de erro
            }
        } else if (cep.length > 0) {
            alert("CEP deve ter 8 dígitos.");
            enderecoInput.value = "";
            console.log("CEP com menos de 8 dígitos.");
        }
    }


    // --- Função Principal de Cadastro ---

    // Esta função é chamada pelo `onclick="cadastrarVoluntario()"` do seu HTML
    window.cadastrarVoluntario = function() { // Torna a função global para ser acessível pelo onclick
        console.log('Função cadastrarVoluntario chamada.');
        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value; // Pega o valor da senha
        const cep = cepInput.value.trim();
        const endereco = enderecoInput.value.trim();

        // Validação de campos obrigatórios
        // *** CORREÇÃO APLICADA AQUI: `!!senha` mudado para `!senha` ***
        if (!nome || !email || !senha || !cep || !endereco) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            console.warn("Campos obrigatórios não preenchidos.");
            return;
        }

        // Validação básica de senha
        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            console.warn("Senha muito curta (mínimo 6 caracteres).");
            return;
        }

        const voluntariosSalvos = JSON.parse(localStorage.getItem("voluntarios")) || [];
        console.log('Voluntários existentes no LocalStorage:', voluntariosSalvos);

        // *** VALIDAÇÃO DE E-MAIL DUPLICADO ACRESCENTADA AQUI ***
        const emailExiste = voluntariosSalvos.some(v => v.email.toLowerCase() === email.toLowerCase());
        if (emailExiste) {
            alert("Erro: Já existe um voluntário cadastrado com este e-mail.");
            console.warn("Tentativa de cadastro com e-mail duplicado.");
            return; // Impede o cadastro se o e-mail for duplicado
        }
        // *** FIM DA VALIDAÇÃO DE E-MAIL DUPLICADO ***

        // GERAÇÃO DA FOTO DE PERFIL ALEATÓRIA
        // Alterado para usar Unsplash Source com cache-busting forte para fotos de pessoas
        // Esta é a URL que puxará uma imagem aleatória de pessoa a cada vez
        const fotoURL = `https://source.unsplash.com/160x160/?person&t=${Date.now()}`;
        
        console.log('URL da foto gerada:', fotoURL);

        const novoVoluntario = {
            id: Date.now(), // ID único para cada voluntário (útil para exclusão)
            nome,
            email,
            senha, // ADICIONA A SENHA AO OBJETO DO VOLUNTÁRIO
            endereco,
            foto: fotoURL // A URL da foto gerada é atribuída aqui
        };

        voluntariosSalvos.push(novoVoluntario);
        localStorage.setItem("voluntarios", JSON.stringify(voluntariosSalvos));
        console.log('Voluntário cadastrado e salvo no LocalStorage:', novoVoluntario);

        // --- LÓGICA DE FEEDBACK PÓS-CADASTRO ---
        msgParagraph.style.display = "block"; // Exibe a mensagem de sucesso
        msgParagraph.classList.remove('hidden'); // Garante que a classe hidden seja removida se houver

        // Limpa os campos do formulário
        nomeInput.value = "";
        emailInput.value = "";
        senhaInput.value = "";
        cepInput.value = "";
        enderecoInput.value = "";

        // Oculta os botões de ação originais
        cadastrarButton.classList.add('hidden');
        voltarButton.classList.add('hidden');
        console.log("Botões 'Cadastrar' e 'Voltar' ocultos.");

        // Exibe o botão "Ir para o Login" após um breve atraso
        setTimeout(() => {
            msgParagraph.classList.add('hidden'); // Oculta a mensagem de sucesso
            goToLoginBtn.classList.remove('hidden'); // Exibe o botão "Ir para o Login"
            console.log("Mensagem de sucesso oculta, botão 'Ir para o Login' exibido.");
        }, 2000); // 2 segundos para o usuário ler a mensagem

        exibirCards(); // Atualiza a exibição dos cards
        alert("Voluntário cadastrado com sucesso!"); // Feedback adicional imediato
    }


    // --- Função Voltar ---

    // Esta função é chamada pelo `onclick="voltar()"` do seu HTML
    window.voltar = function() {
        console.log('Função voltar chamada. Redirecionando para home.html');
        window.location.href = "home.html";
    }


    // --- Funções de Exibição e Exclusão de Cards ---

    function exibirCards() {
        console.log('Função exibirCards chamada.');
        cardsContainer.innerHTML = ""; // Limpa os cards existentes

        const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
        console.log('Voluntários carregados do LocalStorage para exibição:', voluntarios);

        if (voluntarios.length === 0) {
            cardsContainer.innerHTML = "<p style='text-align: center; color: #777; width: 100%;'>Nenhum voluntário cadastrado ainda.</p>";
            console.log('Nenhum voluntário encontrado para exibir cards.');
            // Se não houver voluntários, garante que os botões de cadastro originais estejam visíveis
            cadastrarButton.classList.remove('hidden');
            voltarButton.classList.remove('hidden');
            goToLoginBtn.classList.add('hidden'); // Oculta o botão de login
            msgParagraph.classList.add('hidden'); // Oculta a mensagem de sucesso
            return;
        }

        voluntarios.forEach(v => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${v.foto}" alt="Foto de ${v.nome}">
                <h3>${v.nome}</h3>
                <p><strong>Email:</strong> ${v.email}</p>
                <p><strong>Endereço:</strong> ${v.endereco}</p>
                <button class="delete-button" data-id="${v.id}">Excluir</button>
            `;
            cardsContainer.appendChild(card);
        });
        console.log('Cards renderizados. Anexando event listeners aos botões de exclusão.');

        // Anexa event listeners APÓS os cards serem adicionados ao DOM
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                console.log('Botão de exclusão clicado.');
                const idParaExcluir = parseInt(event.target.dataset.id);
                console.log('ID do voluntário a ser excluído:', idParaExcluir, 'Tipo:', typeof idParaExcluir);
                excluirVoluntario(idParaExcluir);
            });
        });
    }

    function excluirVoluntario(id) {
        console.log('Função excluirVoluntario chamada com ID:', id);
        if (confirm('Tem certeza que deseja excluir este voluntário?')) {
            let voluntariosAtuais = JSON.parse(localStorage.getItem("voluntarios")) || [];
            console.log('Voluntários antes da exclusão:', voluntariosAtuais);

            voluntariosAtuais = voluntariosAtuais.filter(v => {
                const match = v.id === id;
                console.log(`Comparando v.id=${v.id} (tipo:${typeof v.id}) com id=${id} (tipo:${typeof id}). Match: ${match}`);
                return !match; // Retorna true para manter, false para remover
            });

            localStorage.setItem("voluntarios", JSON.stringify(voluntariosAtuais));
            console.log('Voluntários após a exclusão e salvos no LocalStorage:', voluntariosAtuais);

            exibirCards(); // Re-exibe os cards para refletir a exclusão
            alert("Voluntário excluído com sucesso!");

            // Se a lista de voluntários ficar vazia após a exclusão, re-exibe os botões de cadastro
            if (voluntariosAtuais.length === 0) {
                cadastrarButton.classList.remove('hidden');
                voltarButton.classList.remove('hidden');
                goToLoginBtn.classList.add('hidden'); // Oculta o botão de login se não houver usuários
                msgParagraph.classList.add('hidden'); // Oculta a mensagem de sucesso
                console.log("Todos os voluntários excluídos. Botões de cadastro/voltar reexibidos.");
            }
        } else {
            console.log('Exclusão cancelada pelo usuário.');
        }
    }
});