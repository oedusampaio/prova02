document.addEventListener('DOMContentLoaded', () => {
    console.log('home.js carregado. Iniciando script da página inicial.');

    // --- Referências aos elementos HTML ---
    const welcomeMessage = document.getElementById("welcomeMessage");
    const listVolunteersBtn = document.getElementById("listVolunteersBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const volunteersListSection = document.getElementById("volunteersListSection");
    const cardsContainerHome = document.getElementById("cardsContainerHome");
    const noVolunteersMessage = document.getElementById("noVolunteersMessage");

    // --- Controle de Sessão por Inatividade (já existente) ---
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos
    let timeoutId; 

    function resetTimer() {
        console.log('Atividade detectada na Home. Resetando timer de inatividade.');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    }

    function logoutUser() {
        console.warn('Usuário inativo por muito tempo na Home. Redirecionando para a tela de login.');
        // Limpar dados de sessão ao fazer logout
        localStorage.removeItem('usuarioLogado'); // Exemplo: se você salvar o usuário logado
        alert('Você foi desconectado(a) devido à inatividade.');
        window.location.href = 'login.html';
    }

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
        document.addEventListener(event, resetTimer, false);
    });

    // Iniciar o timer na primeira vez que a página carrega
    resetTimer();
    console.log(`Controle de sessão ativo na Home. Tempo limite de inatividade: ${INACTIVITY_TIMEOUT / 1000 / 60} minutos.`);

    // --- Funcionalidades da Página Home ---

    // Exibir mensagem de boas-vindas com o nome do usuário (se estiver salvo no localStorage)
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')); // Assumindo que você salva isso no login
    if (usuarioLogado && welcomeMessage) {
        welcomeMessage.textContent = `Olá, ${usuarioLogado.nome}! Sua dedicação faz a diferença.`;
        console.log('Mensagem de boas-vindas atualizada.');
    } else {
        console.log('Nenhum usuário logado encontrado no localStorage ou elemento welcomeMessage ausente.');
        // Opcional: Redirecionar para login se não houver usuário logado (proteção básica)
        // window.location.href = 'login.html';
    }

    // Função para fazer logout ao clicar no botão "Sair"
    window.fazerLogout = function() {
        if (confirm('Tem certeza que deseja sair?')) {
            console.log('Usuário escolheu fazer logout.');
            localStorage.removeItem('usuarioLogado'); // Limpa o estado de login
            clearTimeout(timeoutId); // Limpa o timer de inatividade
            window.location.href = 'login.html'; // Redireciona para a tela de login
        }
    };

    // Função para exibir os voluntários cadastrados
    window.exibirVoluntarios = function() {
        console.log('Botão "Lista de Voluntários" clicado. Exibindo voluntários...');
        
        cardsContainerHome.innerHTML = ""; // Limpa os cards existentes
        
        // Pega todos os voluntários do localStorage (a mesma chave usada no cadastro)
        const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
        console.log('Voluntários carregados do LocalStorage:', voluntarios);

        if (voluntarios.length === 0) {
            volunteersListSection.classList.remove('hidden'); // Mostra a seção
            noVolunteersMessage.classList.remove('hidden'); // Mostra a mensagem de "nenhum voluntário"
            cardsContainerHome.classList.add('hidden'); // Esconde o container de cards se não houver nenhum
            console.log('Nenhum voluntário encontrado para exibir.');
            return;
        }

        volunteersListSection.classList.remove('hidden'); // Mostra a seção
        noVolunteersMessage.classList.add('hidden'); // Esconde a mensagem de "nenhum voluntário"
        cardsContainerHome.classList.remove('hidden'); // Mostra o container de cards

        voluntarios.forEach(v => {
            const card = document.createElement("div");
            card.className = "card"; // Reutiliza a classe 'card' do CSS de cadastro
            card.innerHTML = `
                <img src="${v.foto}" alt="Foto de ${v.nome}">
                <h3>${v.nome}</h3>
                <p><strong>Email:</strong> ${v.email}</p>
                <p><strong>Endereço:</strong> ${v.endereco}</p>
                <button class="delete-button" data-id="${v.id}">Excluir</button>
            `;
            cardsContainerHome.appendChild(card);
        });
        console.log('Cards de voluntários renderizados na Home.');

        // Adiciona event listeners aos botões de exclusão (se existirem na home)
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                console.log('Botão de exclusão clicado na Home.');
                const idParaExcluir = parseInt(event.target.dataset.id);
                excluirVoluntario(idParaExcluir);
            });
        });
    };

    // Função de exclusão de voluntário (reutilizada do cadastro, se aplicável na home)
    function excluirVoluntario(id) {
        console.log('Função excluirVoluntario chamada na Home com ID:', id);
        if (confirm('Tem certeza que deseja excluir este voluntário?')) {
            let voluntariosAtuais = JSON.parse(localStorage.getItem("voluntarios")) || [];
            voluntariosAtuais = voluntariosAtuais.filter(v => v.id !== id);
            localStorage.setItem("voluntarios", JSON.stringify(voluntariosAtuais));
            console.log('Voluntário excluído e LocalStorage atualizado.');

            // Re-exibe a lista para refletir a exclusão
            exibirVoluntarios(); 
            alert("Voluntário excluído com sucesso!");
        } else {
            console.log('Exclusão cancelada pelo usuário na Home.');
        }
    }
});