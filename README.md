# Uma história em andamento

Uma experiência pessoal e interativa, construída em HTML, CSS e JavaScript e publicada como site estático pelo GitHub Pages.

**Acesse:** https://iamdatagabs.github.io/life_project/

## Estrutura do projeto

- `index.html` — conteúdo, capítulos, imagens e estrutura da página.
- `style.css` — identidade visual, tipografia e comportamento responsivo.
- `script.js` — controles de áudio, animações e interações.
- `assets/` — arquivos de áudio e imagens utilizados no site.

## Recursos

- Layout responsivo para celular e desktop.
- Linha do tempo com capítulos e uma barra dinâmica que acompanha a leitura, indicando cidades e distâncias aproximadas em linha reta.
- Trilha sonora com tentativa de reprodução automática. Como navegadores podem bloquear áudio automático, há também um controle manual para iniciar ou pausar a música.
- Botão de interação final integrado ao EmailJS para enviar uma notificação quando for acionado.

**Observação:** a notificação confirma apenas que o botão foi clicado; não permite saber se a página inteira foi lida. O funcionamento do envio depende da configuração do serviço EmailJS.

## Publicação

O site é servido pelo GitHub Pages a partir da branch `main`, na raiz do repositório.

Para configurar ou conferir a publicação:

1. Abra **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde a publicação.

## Manutenção

Edite os arquivos diretamente no repositório. Ao atualizar o conteúdo ou os estilos, o GitHub Pages publica a nova versão após concluir o processo de deploy.

A trilha sonora e as imagens ficam em `assets/`. Utilize apenas arquivos que você tenha autorização para publicar.
