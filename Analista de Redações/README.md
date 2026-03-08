# Plano de Construção: RedaçãoPro (Analista de Redações ENEM)

O objetivo é desenvolver um Web App moderno e intuitivo, focado na análise de redações do ENEM, inspirado em interfaces de edição ricas (como o Untitled UI, conforme a imagem de referência). 

## Estrutura do App (Frontend)
1. **Layout**: O design será composto por um dashboard em formato de "Split View":
   - **Barra Lateral Esquerda (Sidebar)**: Tons pastéis/bege, navegação de áreas (Login/Histórico, Nova Correção, Dicas de Repertório).
   - **Área Principal**: Fundo branco, com título da seção e o foco no conteúdo.
   - **Barra Lateral Direita (Opcional)**: Exibições complementares, como competências do ENEM avaliadas ou resumo do repertório sugerido.

2. **Seções Principais**:
   - **Login / Histórico de Correções**: Uma área onde o usuário faz o "log in" (vamos mockar os dados) e visualiza um painel com suas redações enviadas, notas gerais de 0 a 1000 e status (corrigido/a corrigir).
   - **Home (Nova Correção)**: Uma área semelhante a um editor de texto rico. O usuário deverá digitar/colar sua redação, preencher um tema e clicar em "Enviar para Análise". Deverá exalar uma sensação "premium" durante a interação.
   - **Dicas de Repertório**: O usuário digita um tema e o app lista ideias de filmes, livros, citações filosóficas e como articulá-las, respeitando o formato oficial do INEP para a competência II.

## Funcionalidades Dinâmicas (JavaScript)
- **Navegação SPA (Single Page Application)**: Alternar as views sem recarregar a página (escondendo e mostrando as seções correspondentes).
- **Simulação de Correção API**: Criar um mock assíncrono que demora de 1 a 2 segundos devolvendo uma correção baseada nas 5 Competências do ENEM.
- **Simulação de Repertório**: Mock que sugere 2 ou 3 repertórios para o tema informado.

## Tecnologias e Implementação
- **HTML5**: Semântico, focado na estrutura principal.
- **CSS3 Vanilla**: Design refinado, inspirado na imagem (fontes limpas, sistema de cores suaves como #F3F1EC para o menu e #111111 para contraste). Flexbox e Grid para responsividade.
- **JavaScript Vanilla**: Módulos e manipulação direta do DOM, criando a experiência interativa fluida sugerida pelo usuário e validando os inputs de forma elegante.
