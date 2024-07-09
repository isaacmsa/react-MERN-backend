const Event = require('../models/Event')

const getEventos = async (req, res) => {
  const events = await Event.find().populate('user', 'name')

  res.json({
    ok: true,
    events,
  })
}
const crearEvento = async (req, res) => {
  const event = new Event(req.body)

  try {
    event.user = req.uidUser
    const savedEvent = await event.save()

    res.status(201).json({
      ok: true,
      evento: savedEvent,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      mgs: 'Hable con el administrador',
    })
  }
}
const actualizarEvento = async (req, res) => {
  const eventId = req.params.id
  const uid = req.uidUser

  try {
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con ese id',
      })
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento',
      })
    }

    const newEvent = {
      ...req.body,
      user: uid,
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    })

    res.json({
      ok: true,
      evento: updatedEvent,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const eliminarEvento = async (req, res) => {
  const eventId = req.params.id
  const uid = req.uid

  try {
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con ese id',
      })
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento',
      })
    }

    await Event.findByIdAndDelete(eventId)

    res.json({
      ok: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
}
