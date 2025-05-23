# Projeto Voluntariado

Este projeto é uma aplicação web simples para gerenciamento de voluntários, permitindo o cadastro, visualização e exclusão de pessoas interessadas em trabalho voluntário. Desenvolvido com HTML, CSS e JavaScript puro, o projeto utiliza o **localStorage** do navegador para persistir os dados dos voluntários.

---

## Funcionalidades

### Página Inicial (`home.html`):

- **Boas-Vindas Personalizada:** Exibe uma mensagem de boas-vindas com o nome do usuário logado (se houver).  
- **Navegação:** Botões para Login e Cadastro.  
- **Listagem de Voluntários:** Um botão "Lista de Voluntários" permite exibir todos os voluntários cadastrados em formato de cards.  
- **Exclusão de Voluntários:** Cada card na lista possui um botão para excluir o voluntário.  
- **Botão "Sair":** Permite que o usuário faça logout da aplicação.  
- **Controle de Inatividade:** Um timer de 5 minutos redireciona o usuário para a tela de login após inatividade, garantindo uma segurança básica.  

### Página de Login (`login.html`):

- **Autenticação de Usuário:** Permite que voluntários cadastrados façam login usando e-mail e senha.  
- **Contagem Regressiva:** Um timer visível de 5 minutos é exibido. Se o usuário não interagir, ele é redirecionado para a página inicial (`home.html`).  
- **Mensagens de Erro:** Exibe mensagens claras para credenciais inválidas ou campos vazios.  
- **Link para Cadastro:** Opção para novos usuários se cadastrarem.  

### Página de Cadastro (`cadastro.html`):

- **Formulário de Cadastro:** Registro de novos voluntários com nome, e-mail, senha e CEP.  
- **Busca de Endereço Automática:** Ao inserir o CEP, o campo de endereço é preenchido automaticamente via API ViaCEP.  
- **Validação de E-mail:** Impede o cadastro de e-mails duplicados.  
- **Geração de Foto de Perfil:** Foto aleatória gerada automaticamente para cada voluntário usando a Unsplash Source API.  
- **Feedback Pós-Cadastro:** Após o cadastro, exibe mensagem de sucesso e botão "Ir para o Login" para facilitar a navegação.  
- **Listagem de Voluntários:** Exibe os voluntários cadastrados em cards, com opção de exclusão direta na página.  
- **Persistência de Dados:** Todos os dados são armazenados no `localStorage` do navegador, mantendo as informações mesmo após fechar a página (no mesmo navegador).  

---