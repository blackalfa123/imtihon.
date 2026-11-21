const path = require('path')
const dns = require('dns')
const mongoose = require('mongoose')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })


mongoose.set('bufferCommands', false)


function checkUri(uri) {
  if (!uri) {
    throw new Error('backend/.env ichida MONGODB_URI topilmadi.')
  }

  const isPlaceholder = /YOUR_|USERNAME|PASSWORD|CLUSTER|[<>]/.test(uri)

  if (isPlaceholder) {
    throw new Error('backend/.env ichidagi MONGODB_URI hali namuna holatida. Atlas bergan haqiqiy connection stringni yozing.')
  }

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    throw new Error('MONGODB_URI mongodb:// yoki mongodb+srv:// bilan boshlanishi kerak.')
  }
}


function explain(error) {
  const msg = error.message || ''

  if (/querySrv|EBADRESP|ENOTFOUND|ECONNREFUSED.*_mongodb/i.test(msg) || error.code === 'ENOTFOUND') {
    return 'MongoDB DNS/SRV manzili topilmadi. Internet/DNS (provayder) SRV so‘rovini o‘tkazmayapti. Atlas > Connect > Drivers da "standart mongodb:// (non-SRV)" stringni oling yoki kompyuterda DNS ni 8.8.8.8 / 1.1.1.1 ga o‘zgartiring.'
  }

  if (error.code === 18 || /authentication failed|bad auth/i.test(msg)) {
    return 'Autentifikatsiya xato: Atlas > Database Access dagi username/parolni tekshiring (parolda @ : / ? # kabi belgilar bo‘lsa URL-encode qiling).'
  }

  if (/ReplicaSetNoPrimary|Server selection timed out|ETIMEDOUT|ECONNREFUSED/i.test(msg)) {
    return 'Atlas serveriga yetib bo‘lmadi. Atlas > Network Access ga o‘z IP manzilingizni (yoki test uchun 0.0.0.0/0) qo‘shing.'
  }

  if (/Password contains unescaped|Invalid scheme|Invalid connection string/i.test(msg)) {
    return 'Connection string noto‘g‘ri: parolni URL-encode qiling (@ -> %40, # -> %23) va < > belgilarini olib tashlang.'
  }

  return msg
}


async function connectOnce(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4
  })
}


async function connectDatabase() {
  const uri = (process.env.MONGODB_URI || '').trim()

  checkUri(uri)

  try {
    await connectOnce(uri)
  } catch (error) {
    const isSrvUri = uri.startsWith('mongodb+srv://')
    const isDnsError = /querySrv|EBADRESP|ENOTFOUND|ECONNREFUSED/i.test(error.message)

    if (isSrvUri && isDnsError) {
      console.log('SRV DNS xatosi, Google/Cloudflare DNS bilan qayta urinilmoqda...')
      dns.setServers(['8.8.8.8', '1.1.1.1'])

      try {
        await connectOnce(uri)
      } catch (retryError) {
        throw new Error(explain(retryError))
      }
    } else {
      throw new Error(explain(error))
    }
  }

  console.log(`MongoDB ulandi: baza = "${mongoose.connection.name}"`)
}


module.exports = connectDatabase
