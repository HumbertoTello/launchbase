const crypto = require('crypto')

const User = require('../models/User')
const mailer = require('../../lib/mailer')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    // verificar se o usuário está cadastrado
    req.session.userId = req.user.id

    return res.redirect("/users")
    // verificar se o password bate

    // colocar o usuário no req.session (deixar logado)
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotForm (req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const user = req.user

    try {
      // token para usuário
      const token = crypto.randomBytes(20).toString("hex")

      // criar uma expiração de token
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      // enviar um email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de senha',
        html: `<h2>Perdeu a chave?</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
        <p>
          <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
            RECUPERAR SENHA
          </a>
        </p>
        `
      })

      // avisar o usuário que enviamos o e-mail
      return res.render("session/forgot-password", {
        success: "Verifique seu e-mail para resetar sua senha"
      })

    } catch(err) {
      console.error(err)
      return res.render("session/forgot-password", {
        error: "Erro inesperado, tente novamente"
      })
    }
  },
  resetForm (req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  reset (req, res) {
    const { email, password, passwordRepeat, token } = req.body

    try {
      /* VALIDAÇÃO */
      // procurar o usuário

      // ver se a senha bate

      // verificar se o token bate

      // verificar se o token não expirou

      /* */
      // cria um novo hash de senha

      // atualiza o usuário

      // avisa o usuário que ele tem uma nova senha
    } catch (err) {
      console.error(err)
      return res.render("session/forgot-password", {
        error: "Erro inesperado, tente novamente!"
      })
    }
  }
}