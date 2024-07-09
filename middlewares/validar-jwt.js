const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req = request, res = response, next) => {
  // x-token
  const token = req.header('x-token') // este es el nombre del header personalizado que se envia a la peticion

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    })
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED)

    req.uidUser = payload.uidUser
    req.nameUser = payload.nameUser
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    })
  }

  next()
}

module.exports = {
  validarJWT,
}
