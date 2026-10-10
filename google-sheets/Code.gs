/**
 * Бэкенд сайта на Google Sheets (Google Apps Script, Web App).
 *
 *   GET  -> { masters, services, busy }  каталог и занятые слоты (без персональных данных)
 *   POST -> { ok: true } | { ok: false, error }  новая запись, добавляется в лист «Записи на прием»
 *
 * Инструкция по установке: google-sheets/README.md
 */

var SHEET_MASTERS = 'Мастера'
var SHEET_SERVICES = 'Услуги'
var SHEET_BOOKINGS = 'Записи на прием'

var MASTER_HEADERS = [
  'ФИО',
  'Должность',
  'С кем работает',
  'Описание',
  'Подробное описание',
  'Специализация',
  'График работы',
  'Фото',
  'Цвет',
]
var SERVICE_HEADERS = [
  'Название',
  'Длительность (мин)',
  'Для кого',
  'Описание',
  'Подробное описание',
  'Что входит',
  'Важно',
  'Стоимость',
  'Иконка',
  'Цвет',
]
var BOOKING_HEADERS = [
  'Создано',
  'Услуга',
  'Длительность (мин)',
  'Цена',
  'Животное',
  'Мастер',
  'День',
  'Время',
  'Имя',
  'Телефон',
  'Статус',
]
var STATUS_NEW = 'Новая'
var STATUS_CANCELLED = 'Отменена'

var PETS = { dog: 'Собака', cat: 'Кошка' }
var DAYS_AHEAD = 28

/** Один раз запустить вручную: создаёт недостающие листы с заголовками. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  ensureSheet_(ss, SHEET_MASTERS, MASTER_HEADERS)
  ensureSheet_(ss, SHEET_SERVICES, SERVICE_HEADERS)
  var bookings = ensureSheet_(ss, SHEET_BOOKINGS, BOOKING_HEADERS)
  // День, время и телефон храним текстом: иначе Sheets превратит их в даты/числа
  bookings.getRange(2, 1, bookings.getMaxRows() - 1, BOOKING_HEADERS.length).setNumberFormat('@')
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name)
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  return json_({
    masters: readTable_(ss.getSheetByName(SHEET_MASTERS)),
    services: readTable_(ss.getSheetByName(SHEET_SERVICES)),
    busy: readBusy_(ss.getSheetByName(SHEET_BOOKINGS)),
  })
}

function doPost(e) {
  var lock = LockService.getScriptLock()
  // Два одновременных клиента не должны занять один и тот же слот
  if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' })
  try {
    var req = JSON.parse(e.postData.contents)
    return json_(createBooking_(req))
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' })
  } finally {
    lock.releaseLock()
  }
}

function createBooking_(req) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var tz = ss.getSpreadsheetTimeZone()

  // Цена и длительность берутся из листа, а не от клиента
  var service = findRow_(ss.getSheetByName(SHEET_SERVICES), 'Название', req.service)
  var master = findRow_(ss.getSheetByName(SHEET_MASTERS), 'ФИО', req.master)
  if (!service || !master) return { ok: false, error: 'unknown_item' }

  var pet = PETS[req.pet]
  var date = String(req.date || '')
  var time = String(req.time || '')
  var name = String(req.name || '')
    .trim()
    .slice(0, 100)
  var phone = String(req.phone || '')
    .trim()
    .slice(0, 30)
  var hour = parseInt(time, 10)

  if (!pet) return { ok: false, error: 'bad_request' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:00$/.test(time))
    return { ok: false, error: 'bad_request' }
  if (!name || phone.replace(/\D/g, '').length < 11) return { ok: false, error: 'bad_request' }

  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd')
  var last = Utilities.formatDate(new Date(Date.now() + DAYS_AHEAD * 86400000), tz, 'yyyy-MM-dd')
  if (date < today || date > last) return { ok: false, error: 'bad_date' }

  var mins = Number(service['Длительность (мин)']) || 60
  var hours = Math.ceil(mins / 60)
  var busy = readBusy_(ss.getSheetByName(SHEET_BOOKINGS))
  for (var i = 0; i < busy.length; i++) {
    var b = busy[i]
    if (
      b.master === master['ФИО'] &&
      b.date === date &&
      hour < b.hour + b.hours &&
      b.hour < hour + hours
    ) {
      return { ok: false, error: 'slot_taken' }
    }
  }

  var sheet = ss.getSheetByName(SHEET_BOOKINGS)
  var row = sheet.getLastRow() + 1
  var range = sheet.getRange(row, 1, 1, BOOKING_HEADERS.length)
  range.setNumberFormat('@') // текст: исключает формулы (=...) и автопреобразование
  range.setValues([
    [
      Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss'),
      service['Название'],
      mins,
      service['Стоимость'],
      pet,
      master['ФИО'],
      date,
      time,
      name,
      phone,
      STATUS_NEW,
    ],
  ])
  return { ok: true }
}

/** Лист -> массив объектов {заголовок: значение}. Пустые строки пропускаются. */
function readTable_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return []
  var values = sheet.getDataRange().getDisplayValues()
  var headers = values[0].map(function (h) {
    return String(h).trim()
  })
  return values
    .slice(1)
    .filter(function (r) {
      return String(r[0]).trim() !== ''
    })
    .map(function (r) {
      var o = {}
      headers.forEach(function (h, i) {
        o[h] = r[i]
      })
      return o
    })
}

function findRow_(sheet, key, value) {
  var rows = readTable_(sheet)
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][key].trim() === String(value || '').trim()) return rows[i]
  }
  return null
}

/** Занятые слоты: только мастер, день, час и число часов. Имя и телефон наружу не отдаются. */
function readBusy_(sheet) {
  return readTable_(sheet)
    .filter(function (r) {
      return r['Статус'].trim() !== STATUS_CANCELLED
    })
    .map(function (r) {
      return {
        master: r['Мастер'].trim(),
        date: r['День'].trim(),
        hour: parseInt(r['Время'], 10),
        hours: Math.ceil((Number(r['Длительность (мин)']) || 60) / 60),
      }
    })
    .filter(function (b) {
      return b.master && b.date && !isNaN(b.hour)
    })
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
