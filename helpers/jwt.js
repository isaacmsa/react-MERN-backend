const jwt = require('jsonwebtoken')

const generarJWT = (uidUser, nameUser) => {
  return new Promise((resolve, reject) => {
    const payload = { uidUser, nameUser }

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: '2h',
      },
      (error, token) => {
        if (error) {
          console.log(error)
          reject('No se pudo generar el token')
        }

        resolve(token)
      }
    )
  })
}

module.exports = {
  generarJWT,
}
