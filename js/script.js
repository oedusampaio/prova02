document.addEventListener('DOMContentLoaded', () => {
    console.log('Script de login carregado. DOM pronto.');

    // --- Referências aos elementos HTML da tela de login ---
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const errorMessageDiv = document.getElementById("error-message");
    const countdownElement = document.getElementById("countdown"); // Novo: Elemento do relógio

    // Verifica se os elementos essenciais foram encontrados
    if (!emailInput || !senhaInput || !countdownElement) { // Incluído countdownElement na verificação
        console.error("Erro fatal: Um ou mais elementos HTML essenciais (email, senha ou relógio) não foram encontrados no HTML da tela de login. Verifique os IDs.");
        if (errorMessageDiv) {
            errorMessageDiv.textContent = "Erro na inicialização da página. Contate o suporte.";
            errorMessageDiv.classList.remove('hidden');
        } else {
            alert("Erro: Não foi possível encontrar os campos de login ou o relógio. Verifique o console.");
        }
        return; // Interrompe a execução do script se os elementos não forem encontrados
    } else {
        console.log("Elementos de input de login e relógio encontrados.");
    }

    if (!errorMessageDiv) {
        console.warn("Elemento 'error-message' não encontrado no HTML de login. Mensagens de erro visuais podem não funcionar.");
    }

    // --- Controle de Tempo de Alarme (5 minutos para home.html) ---
    const ALARM_TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos
    // Para TESTAR MAIS RÁPIDO, mude para: const ALARM_TIMEOUT = 10 * 1000; // 10 segundos
    
    let alarmTimerId; // Variável para armazenar o ID do timer de redirecionamento
    let countdownIntervalId; // Novo: Variável para armazenar o ID do intervalo do relógio visível
    let timeLeft = ALARM_TIMEOUT; // Novo: Tempo restante em milissegundos

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateCountdownDisplay() {
        countdownElement.textContent = formatTime(timeLeft);
        if (timeLeft < 60000 && timeLeft > 0) { // Menos de 1 minuto
            countdownElement.classList.add('warning'); // Adiciona classe para estilo de aviso
        } else {
            countdownElement.classList.remove('warning');
        }
    }

    function startAlarmTimer() {
        console.log(`[Timer] Alarme iniciado. Redirecionamento para home.html em ${ALARM_TIMEOUT / 1000 / 60} minutos.`);
        clearTimeout(alarmTimerId); // Garante que apenas um timer de redirecionamento esteja ativo
        clearInterval(countdownIntervalId); // Limpa o intervalo do relógio anterior

        timeLeft = ALARM_TIMEOUT; // Reseta o tempo restante
        updateCountdownDisplay(); // Atualiza display imediatamente

        // Inicia o intervalo para atualizar o relógio a cada segundo
        countdownIntervalId = setInterval(() => {
            timeLeft -= 1000; // Diminui 1 segundo
            if (timeLeft <= 0) {
                timeLeft = 0; // Garante que não vá para tempo negativo
                updateCountdownDisplay();
                clearInterval(countdownIntervalId); // Para de atualizar o relógio
                console.log('[Timer] Tempo limite atingido. Redirecionando...');
                alert('Tempo limite na tela de login atingido. Redirecionando para a página inicial.');
                window.location.href = 'home.html'; // Redireciona
            } else {
                updateCountdownDisplay(); // Atualiza o display
            }
        }, 1000); // Atualiza a cada segundo (1000ms)

        // Define o timer de redirecionamento principal (fallback)
        alarmTimerId = setTimeout(() => {
             // Este setTimeout será executado caso o setInterval não consiga redirecionar por algum motivo
             // (embora o setInterval já cuide do redirecionamento agora)
            console.warn('[Timer] Redirecionamento por setTimeout acionado como fallback.');
            window.location.href = 'home.html';
        }, ALARM_TIMEOUT);
    }

    function resetAlarmTimer() {
        // console.log('[Timer] Atividade na tela de login detectada. Reiniciando alarme.'); // Descomente para ver cada reset
        startAlarmTimer(); // Reinicia o timer e o display do relógio a cada atividade
    }

    // Adiciona event listeners para reiniciar o alarme em caso de atividade
    const activityEvents = [
        'mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'
    ];
    activityEvents.forEach(event => {
        document.addEventListener(event, resetAlarmTimer, false);
    });

    // Inicia o alarme quando a página é carregada
    startAlarmTimer();

    // --- Lógica da Função de Login ---
    window.fazerLogin = function() {
        console.log('Função fazerLogin chamada.');
        
        // Se o login for tentado, o alarme e o relógio são parados
        clearTimeout(alarmTimerId); 
        clearInterval(countdownIntervalId);
        console.log('[Timer] Alarme e relógio parados devido a tentativa de login.');

        const emailDigitado = emailInput.value.trim();
        const senhaDigitada = senhaInput.value; 

        // Limpa mensagens de erro anteriores, se a div existir
        if (errorMessageDiv) {
            errorMessageDiv.classList.add('hidden');
            errorMessageDiv.textContent = '';
        }

        if (!emailDigitado || !senhaDigitada) {
            if (errorMessageDiv) {
                errorMessageDiv.textContent = "Por favor, preencha todos os campos.";
                errorMessageDiv.classList.remove('hidden');
            } else {
                alert("Por favor, preencha todos os campos.");
            }
            console.warn("Campos de login vazios.");
            startAlarmTimer(); // Se falhar na validação, reinicia o alarme
            return;
        }

        const voluntariosSalvosJSON = localStorage.getItem("voluntarios");
        console.log('Dados brutos do LocalStorage para "voluntarios":', voluntariosSalvosJSON);

        if (!voluntariosSalvosJSON) {
            if (errorMessageDiv) {
                errorMessageDiv.textContent = "Nenhum voluntário cadastrado ainda.";
                errorMessageDiv.classList.remove('hidden');
            } else {
                alert("Nenhum voluntário cadastrado ainda.");
            }
            console.warn("LocalStorage 'voluntarios' vazio ou não existe.");
            startAlarmTimer(); // Se não tiver usuários, reinicia o alarme
            return;
        }

        let voluntarios = [];
        try {
            voluntarios = JSON.parse(voluntariosSalvosJSON);
            console.log('Voluntários parseados do LocalStorage:', voluntarios);
        } catch (e) {
            console.error("Erro ao fazer parse dos voluntários do LocalStorage:", e);
            if (errorMessageDiv) {
                errorMessageDiv.textContent = "Erro ao carregar dados de voluntários (formato inválido).";
                errorMessageDiv.classList.remove('hidden');
            } else {
                alert("Erro ao carregar dados de voluntários.");
            }
            startAlarmTimer(); // Se o parse falhar, reinicia o alarme
            return;
        }

        const voluntarioEncontrado = voluntarios.find(v =>
            v.email.toLowerCase() === emailDigitado.toLowerCase() && v.senha === senhaDigitada
        );

        if (voluntarioEncontrado) {
            console.log('Login bem-sucedido para:', voluntarioEncontrado.email);
            alert("Login bem-sucedido!");
            // Redireciona para a página principal ou área logada
            window.location.href = "home.html"; // Altere para a página que desejar
        } else {
            console.warn('Falha no login: Email ou senha incorretos.');
            if (errorMessageDiv) {
                errorMessageDiv.textContent = "Email ou senha incorretos.";
                errorMessageDiv.classList.remove('hidden');
            } else {
                alert("Email ou senha incorretos.");
            }
            startAlarmTimer(); // Se o login falhar, reinicia o alarme
        }
    }; // Fim da função fazerLogin
});