# CatWatch - Reporte e Rastreie Avistamentos de Gatos

Um aplicativo web desenvolvido para ajudar usuários a reportar e rastrear avistamentos de gatos, especialmente gatos de rua ou desaparecidos. Ele oferece um mapa interativo para visualizar os avistamentos e um formulário para enviar relatórios detalhados.

## Tabela de Conteúdos
1. [Sobre o Projeto](#sobre-o-projeto)
    * [Funcionalidades](#funcionalidades)
    * [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Primeiros Passos](#primeiros-passos)
    * [Pré-requisitos](#pré-requisitos)
    * [Instalação](#instalação)
3. [Como Usar](#como-usar)
4. [Contribuidores](#contribuidores)
5. [Contato](#contato)

---

## Sobre o Projeto

O CatWatch visa criar uma plataforma comunitária para reportar e rastrear avistamentos de gatos. Se você avistou um gato de rua que precisa de ajuda ou está procurando um animal de estimação perdido, o CatWatch fornece ferramentas para registrar e visualizar essas observações importantes em um mapa.

### Funcionalidades

-   **Reportar Avistamentos:** Envie facilmente novos avistamentos de gatos com detalhes como fotos, localização, cor da pelagem, padrão, tamanho, status (de rua/com dono) e se possui coleira.
-   **Mapa Interativo:** Visualize todos os avistamentos de gatos reportados em um mapa dinâmico, ajudando a identificar padrões ou áreas com avistamentos frequentes.
-   **Integração de Geolocalização:** Detecte automaticamente sua localização atual para relatórios de avistamento precisos.
-   **Upload de Imagens:** Faça o upload de fotos do gato para fornecer identificação visual.
-   **Atributos Detalhados do Gato:** Categorize os avistamentos por cor de pelagem, padrão, tamanho e status para ajudar na identificação e rastreamento.
-   **Autenticação de Usuário:** Reporte avistamentos de forma segura com contas de usuário gerenciadas pelo Firebase Authentication.

### Tecnologias Utilizadas

-   **[Next.js](https://nextjs.org/)**: Framework React para a construção de aplicativos web de alto desempenho.
-   **[React](https://react.dev/)**: Biblioteca JavaScript para a construção de interfaces de usuário.
-   **[TypeScript](https://www.typescriptlang.org/)**: Adiciona definições de tipo estáticas e robustez à base de código.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS focado em utilitários para o desenvolvimento rápido e responsivo de interfaces.
-   **[Firebase](https://firebase.google.com/)**: Plataforma de desenvolvimento de aplicativos móveis e web do Google, utilizada para:
    -   **Firestore**: Banco de dados NoSQL em nuvem
    -   **Firebase Storage**: Armazenamento em nuvem para imagens.
    -   **Firebase Authentication**: Para autenticação e gerenciamento de usuários.
-   **[Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/)**: Biblioteca JavaScript de código aberto para mapas interativos e amigáveis para dispositivos móveis.

---

## Primeiros Passos

Siga os passos abaixo para obter uma cópia do projeto e executá-la em sua máquina local para fins de desenvolvimento e testes.

### Pré-requisitos

-   Um navegador web moderno (Chrome, Firefox, Edge, etc.).
-   [Node.js](https://nodejs.org/) (versão LTS recomendada).
-   Um **Projeto no Google Cloud** com o **Firebase** configurado (Firestore, Storage, Authentication).

### Instalação

1.  Clone ou baixe os arquivos deste repositório:
    ```bash
    git clone https://github.com/BragaMPedro/Cat-Watch---Atividade-Extensionista-2
    ```

2.  Instale as dependências do projeto:
    ```bash
    cd Cat-Watch---Atividade-Extensionista-2
    npm install
    ```

3.  **Configure o Firebase**:
    Certifique-se de que o arquivo `firebase-applet-config.json` com a configuração do seu projeto Firebase está correto. Este arquivo deve conter as chaves de API do seu projeto Firebase e outras configurações. Você pode encontrar essas informações nas configurações do seu projeto Firebase.
    Exemplo de `firebase-applet-config.json`:
    ```json
    {
     "projectId": "YOUR_PROJECT_ID",
     "appId": "YOUR_APP_ID",
     "apiKey": "YOUR_FIREBASE_API_KEY",
     "authDomain": "YOUR_AUTH_DOMAIN",
     "firestoreDatabaseId": "YOUR_DEFAULT_FIREBASE_DATABASE_ID",
     "storageBucket": "YOUR_STORAGE_BUCKET",
     "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
     "measurementId": ""
   }
    ```

4.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## Como Usar

1.  Acesse o aplicativo em seu navegador web.
2.  **Reportar um Avistamento** (Login necessário): Navegue até a página "Reportar Avistamento".
    * **Foto**: Toque para tirar ou fazer o upload de uma foto do gato.
    * **Localização**: Sua localização será detectada automaticamente. Certifique-se de que os serviços de localização estão ativados no seu navegador.
    * **Detalhes**: Preencha os detalhes sobre o gato, como cor da pelagem, padrão, tamanho, status (de rua ou com dono), se possui coleira e quaisquer observações adicionais sobre seu comportamento ou condição.
    * **Enviar**: Clique em "Salvar Avistamento" para enviar o relatório.
3.  **Visualizar Avistamentos**: Na página principal do mapa, você verá marcadores para todos os avistamentos de gatos reportados. Clique em um marcador para ver um popup com a foto do gato, status e um link para mais detalhes.

---

## Contribuidores:
<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/pedrobragaresume/">
        <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/111090976?v=4" width="100px;" alt=""/>
        <br />
        <sub><b>Pedro Braga</b></sub>
      </a>
      <br />
       <br />
      <a href="https://www.linkedin.com/in/pedrobragaresume/" title="LindedIn">
        <img src="https://img.shields.io/badge/-Pedro-blue?style=flat-square&logo=Linkedin&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

---

## Contato
[Link para o repositório do GitHub](https://github.com/BragaMPedro/Cat-Watch---Atividade-Extensionista-2)
Pedro Braga Magalhães - [pedrobmagalhaes95@gmai.com](mailto:pedrobmagalhaes95@gmail.com)
