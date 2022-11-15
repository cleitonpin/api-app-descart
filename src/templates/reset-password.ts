export const resetPasswordTemplate = (name: string, url: string): string => {
  return `
    <html>
      <body>
        <p>Olá, ${name}</p>
        <p>Esqueceu sua senha?</p>
        <p>Recebemos um pedido de redefinição de senha para sua conta.</p>
        <p>Para redefinir sua senha, clique no link: <a href="${url}" target="_blank" style="color:rgb(38,120,214); text-decoration: underline">Alterar senha</a></p>
        <p>Ou copie e cole a URL em seu navegador:</p>
        <p style="color:rgb(38,120,214); text-decoration:none">${url}</p>
        <br />
        <div>
          <span style="font-weight:bold">Não solicitou alteração?</span>
        </div>
        <span><i>Se você não solicitou a alteração de sua senha, desconsidere este e-mail.</i></span>
        <br />
        <br />
      </body>
    </html>
  `;
}