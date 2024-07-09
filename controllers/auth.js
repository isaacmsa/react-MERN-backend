const { response, request } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req = request, res = response) => {
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo',
      })
    }
    user = new User(req.body)

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    await user.save()
    const token = await generarJWT(user.id, user.name)

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    })
  }
}

const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email',
      })
    }

    // confirmas los passwords
    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      res.status(400).json({
        ok: false,
        msg: 'Password incorrecto',
      })
    }

    const token = await generarJWT(user.id, user.name)

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    })
  }
}

const revalidarToken = async (req, res = response) => {
  const { uidUser, nameUser } = req

  const token = await generarJWT(uidUser, nameUser)

  return res.json({
    ok: true,
    token,
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}
