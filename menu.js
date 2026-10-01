require('dotenv').config()
const { Telegraf, Markup, session } = require('telegraf')
const http = require('http')

// --- 1. HTTP Сервер (для підтримки роботи на хостингах) ---
const PORT = process.env.PORT || 3000
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Bot is alive!')
  })
  .listen(PORT, () => console.log(`🌐 HTTP-сервер запущено на порту ${PORT}`))

// --- 2. БАЗА ДАНИХ ТОВАРІВ ---
const catalog = [
  // --- Світле пиво ---
  {
    id: 'd1',
    name: 'Бланш',
    price: 86,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Пшеничне нефільтроване',
  },
  {
    id: 'd2',
    name: 'Чеський лагер',
    price: 50,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Класичний світлий хміль',
  },
  {
    id: 'd3',
    name: 'Світле медове',
    price: 67,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Приємна медова нотка',
  },
  {
    id: 'd4',
    name: 'Князь Сангушко',
    price: 84,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Живе та витримане',
  },
  {
    id: 'd5',
    name: 'Опілля',
    price: 57,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Традиційне світле',
  },
  {
    id: 'd6',
    name: 'Павлівське',
    price: 50,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Легке та освіжаюче',
  },

  // --- Темне пиво ---
  {
    id: 'd7',
    name: 'Темне медове',
    price: 67,
    step: 0.5,
    unit: 'л',
    cat: 'dark',
    desc: 'Оксамитовий смак з медом',
  },
  {
    id: 'd8',
    name: 'Original Dark',
    price: 53,
    step: 0.5,
    unit: 'л',
    cat: 'dark',
    desc: 'Насичене солодове',
  },

  // --- Особливе ---
  {
    id: 'd9',
    name: 'IPA',
    price: 75,
    step: 0.5,
    unit: 'л',
    cat: 'special',
    desc: 'Яскрава хмелева гірчинка',
  },

  // --- Сидр ---
  {
    id: 'd10',
    name: 'Фраголіно',
    price: 90,
    step: 0.5,
    unit: 'л',
    cat: 'cider',
    desc: 'Зі смаком полуниці',
  },
  {
    id: 'd11',
    name: 'Сидр Яблуко-Диня',
    price: 48,
    step: 0.5,
    unit: 'л',
    cat: 'cider',
    desc: 'Фруктовий мікс',
  },
  {
    id: 'd12',
    name: 'Сидр Яблуко',
    price: 48,
    step: 0.5,
    unit: 'л',
    cat: 'cider',
    desc: 'Освіжаючий класичний',
  },
  {
    id: 'd13',
    name: 'Сидр Шовковиця',
    price: 48,
    step: 0.5,
    unit: 'л',
    cat: 'cider',
    desc: 'Ягідний та ароматний',
  },

  // --- Безалкогольне ---
  {
    id: 'd14',
    name: 'Квас',
    price: 36,
    step: 0.5,
    unit: 'л',
    cat: 'nonAlcoholic',
    desc: 'Традиційний хлібний',
  },
  {
    id: 'd15',
    name: 'Мохіто',
    price: 32,
    step: 0.5,
    unit: 'л',
    cat: 'nonAlcoholic',
    desc: "М'ята та лайм",
  },
  {
    id: 'd16',
    name: 'Сидр Магнус Сект сухий-міцний 8.0%',
    price: 48,
    step: 0.5,
    unit: 'л',
    cat: 'cider',
    desc: 'Сухий та міцний',
  },
  {
    id: 'd17',
    name: 'Мюнхенське',
    price: 46,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Пиво світле пастеризоване',
  },
  {
    id: 'd18',
    name: 'Баварське',
    price: 49,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Світле нефільтроване',
  },
  { id: 'd19', name: 'Віденське', price: 57, step: 0.5, unit: 'л', cat: 'light', desc: 'Cвітле' },
  {
    id: 'd20',
    name: 'Мексиканський лагер',
    price: 90,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: 'Cвітле',
  },

  // --- ЗАКУСКИ (холодні) ---
  { id: 'f1', name: 'Анчоус', price: 55, step: 50, unit: 'г', cat: 'food' },
  { id: 'f2', name: 'Арахіс зі смаком бекону', price: 23, step: 50, unit: 'г', cat: 'food' },
  { id: 'f3', name: 'Арахіс зі смаком сиру', price: 23, step: 50, unit: 'г', cat: 'food' },
  { id: 'f4', name: 'Вуха свині вагові', price: 31, step: 50, unit: 'г', cat: 'food' },
  { id: 'f5', name: 'Вуха свині «Рикун»', price: 35, step: 50, unit: 'г', cat: 'food' },
  { id: 'f6', name: 'Грінки хвилясті (сир)', price: 29, step: 50, unit: 'г', cat: 'food' },
  { id: 'f7', name: 'Грінки фірмові з часником', price: 29, step: 50, unit: 'г', cat: 'food' },
  { id: 'f8', name: 'Грінки холодець з хріном', price: 29, step: 50, unit: 'г', cat: 'food' },
  { id: 'f9', name: 'Джерки курячі гострі', price: 67, step: 50, unit: 'г', cat: 'food' },
  { id: 'f10', name: 'Жовтий смугастик', price: 68, step: 50, unit: 'г', cat: 'food' },
  { id: 'f11', name: 'Ковбаски «Kabanosy»', price: 127, step: 1, unit: 'шт', cat: 'food' },
  { id: 'f12', name: 'Ковбаски «Parmesano»', price: 57, step: 50, unit: 'г', cat: 'food' },
  { id: 'f13', name: 'Ковбаски «Spicy»', price: 253, step: 1, unit: 'шт', cat: 'food' },
  { id: 'f14', name: 'Ікра Корюшки (Немає)', price: 149, step: 50, unit: 'г', cat: 'food' },
  { id: 'f15', name: 'Ікра судака', price: 108, step: 50, unit: 'г', cat: 'food' },
  { id: 'f16', name: 'Ікра тарані', price: 149, step: 50, unit: 'г', cat: 'food' },
  { id: 'f17', name: 'Кільце кальмара', price: 81, step: 50, unit: 'г', cat: 'food' },
  { id: 'f18', name: 'Корюшка з ікрою', price: 92, step: 50, unit: 'г', cat: 'food' },
  { id: 'f19', name: 'Кранч (мікс)', price: 24, step: 50, unit: 'г', cat: 'food' },
  { id: 'f20', name: 'Кріспі мікс смаків', price: 27, step: 50, unit: 'г', cat: 'food' },
  { id: 'f21', name: 'Кукурудза барбекю', price: 34, step: 50, unit: 'г', cat: 'food' },
  { id: 'f22', name: 'Кукурудза «мед/гірчиця»', price: 34, step: 50, unit: 'г', cat: 'food' },
  {
    id: 'f23',
    name: 'Курка «Халяль» теріякі (Немає)',
    price: 75,
    step: 50,
    unit: 'г',
    cat: 'food',
  },
  { id: 'f24', name: 'Курка «Халяль» часник', price: 75, step: 50, unit: 'г', cat: 'food' },
  { id: 'f25', name: 'Курка «Халяль» чілі', price: 75, step: 50, unit: 'г', cat: 'food' },
  { id: 'f26', name: 'Мідія сушена', price: 102, step: 50, unit: 'г', cat: 'food' },
  { id: 'f27', name: 'Охотський посол', price: 63, step: 50, unit: 'г', cat: 'food' },
  { id: 'f28', name: 'Паутинка кальмара червона', price: 88, step: 50, unit: 'г', cat: 'food' },
  { id: 'f29', name: 'Свинина хамон «Теплі моря»', price: 98, step: 50, unit: 'г', cat: 'food' },
  { id: 'f30', name: 'Сир сулугуні (бекон)', price: 33, step: 50, unit: 'г', cat: 'food' },
  { id: 'f31', name: 'Соломка лосося сушена', price: 48, step: 50, unit: 'г', cat: 'food' },
  { id: 'f32', name: 'Стружка кальмара звичайна', price: 80, step: 50, unit: 'г', cat: 'food' },
  { id: 'f33', name: 'Стружка кальмара (краб)', price: 80, step: 50, unit: 'г', cat: 'food' },
  { id: 'f34', name: 'Тарань ікряна', price: 95, step: 50, unit: 'г', cat: 'food' },
  { id: 'f35', name: 'Фісташка', price: 78, step: 50, unit: 'г', cat: 'food' },
  {
    id: 'f36',
    name: 'Чіпси курячі «духмяний перець»',
    price: 84,
    step: 50,
    unit: 'г',
    cat: 'food',
  },
  { id: 'f37', name: 'Картопляні чіпси "сир"»', price: 50, step: 1, unit: 'уп(100г)', cat: 'food' },
  {
    id: 'f38',
    name: 'Картопляні чіпси "бекон"»',
    price: 50,
    step: 1,
    unit: 'уп(100г)',
    cat: 'food',
  },
  {
    id: 'f39',
    name: 'Картопляні чіпси "паприка"»',
    price: 50,
    step: 1,
    unit: 'уп(100г)',
    cat: 'food',
  },
  {
    id: 'f40',
    name: 'Картопляні чіпси "краб"»',
    price: 50,
    step: 1,
    unit: 'уп(100г)',
    cat: 'food',
  },

  // --- ГАРЯЧІ ЗАКУСКИ (ціна вказана за 100г) ---
  { id: 'h1', name: 'Картопля фрі', price: 54, step: 100, unit: 'г', cat: 'hotFood' },
  { id: 'h2', name: 'Нагетси', price: 120, step: 100, unit: 'г', cat: 'hotFood' },
  { id: 'h3', name: 'Курячі крила', price: 120, step: 100, unit: 'г', cat: 'hotFood' },
  { id: 'h4', name: 'Цибулеві кільца', price: 76, step: 100, unit: 'г', cat: 'hotFood' },
  { id: 'h5', name: 'Сирні палочки', price: 100, step: 100, unit: 'г', cat: 'hotFood' },
  { id: 'h6', name: 'Кільця кальмара в темпурі', price: 130, step: 100, unit: 'г', cat: 'hotFood' },

  // --- СОУСИ ---
  { id: 's1', name: 'Соус "Часниковий"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's2', name: 'Соус "Бургер"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's3', name: 'Соус "Сирний"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's4', name: 'Соус "Солодкий" чилі', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's5', name: 'Соус "Манго-чилі"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's6', name: 'Соус "Кисло-солодкий"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's7', name: 'Соус "Брусничний"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
  { id: 's8', name: 'Соус "Барбекю"', price: 10, step: 1, unit: 'шт', cat: 'sauce' },
]

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

// Екранування тексту, який потрапляє в повідомлення з parse_mode: 'HTML'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Години роботи та часовий пояс (час рахується за Києвом незалежно від хостингу)
const TZ = 'Europe/Kyiv'
const WORK_HOURS = { open: '10:00', close: '23:00' } // ← поставте свої години роботи

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const fmtMin = (m) => {
  m = ((m % 1440) + 1440) % 1440
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
}
function nowMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24
  const m = Number(parts.find((p) => p.type === 'minute').value)
  return h * 60 + m
}
function isWithinWorkHours(m) {
  const o = toMin(WORK_HOURS.open)
  const c = toMin(WORK_HOURS.close)
  return o <= c ? m >= o && m <= c : m >= o || m <= c
}

const bot = new Telegraf(process.env.BOT_TOKEN)

// --- ГЛОБАЛЬНИЙ ОБРОБНИК ПОМИЛОК ---
bot.catch((err, ctx) => {
  console.error(`❌ Помилка в обробнику "${ctx.updateType}":`, err)
  try {
    if (ctx.callbackQuery) {
      ctx.answerCbQuery('⚠️ Сталася помилка, спробуйте ще раз').catch(() => {})
    } else {
      ctx.reply('⚠️ Сталася помилка. Спробуйте /start ще раз.').catch(() => {})
    }
  } catch (e) {
    // ігноруємо вторинну помилку під час звітування про першу
  }
})

// Додаткова страховка: якщо помилка виникне поза обробниками Telegraf
// (наприклад, у самому HTTP-сервері), процес все одно не впаде мовчки.
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Необроблена помилка (unhandledRejection):', reason)
})
process.on('uncaughtException', (err) => {
  console.error('⚠️ Критична помилка (uncaughtException):', err)
})

// --- 3. СЕСІЇ ДЛЯ КОШИКА ТА СТАНУ ---
bot.use(
  session({
    defaultSession: () => ({
      cart: [],
      awaitingAmountFor: null,
      awaitingComment: false,
      awaitingPickupTime: false,
      comment: null,
      pickup: null,
    }),
  })
)

// Будь-яке натискання кнопки (крім "Вказати час") скасовує очікування часу видачі,
// щоб випадковий текст пізніше не сприймався як час.
bot.use((ctx, next) => {
  if (ctx.callbackQuery && ctx.callbackQuery.data !== 'pickup_custom' && ctx.session) {
    ctx.session.awaitingPickupTime = false
  }
  return next()
})

const ITEMS_PER_PAGE = 7

function getCategoryMenu(catId, title) {
  const items = catalog.filter((i) => i.cat === catId)
  let text = `🍻 <b>${title}</b>\n───────────────\n<i>Натисніть на товар, щоб додати у кошик:</i>\n\n`

  const buttons = items.map((item) => {
    const isOut = item.name.includes('(Немає)')
    text += `▫️ <b>${item.name}</b> \n└ 💳 <b>${item.price} грн</b> / ${item.step} ${item.unit} ${item.desc ? '• <i>' + item.desc + '</i>' : ''}\n\n`

    // Якщо немає в наявності - просто виводимо текст, але не додаємо кнопку, або додаємо з повідомленням
    if (isOut) return [Markup.button.callback(`❌ ${item.name} (Немає)`, 'noop')]
    return [Markup.button.callback(`🛒 Додати: ${item.name}`, `buy_${item.id}`)]
  })

  buttons.push([Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')])
  buttons.push([Markup.button.callback('🛒 Перейти до кошика', 'view_cart')])

  return { text, keyboard: Markup.inlineKeyboard(buttons) }
}

// Універсальна функція для сторінкованих категорій закусок (холодні / гарячі / соуси).
// catId — категорія в catalog, title — заголовок, icon — емодзі, backAction — куди веде "Назад".
function getPagedCategoryMenu(catId, title, icon, backAction, page = 0) {
  const items = catalog.filter((i) => i.cat === catId)
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const start = page * ITEMS_PER_PAGE
  const pageItems = items.slice(start, start + ITEMS_PER_PAGE)

  let text = `${icon} <b>${title}</b>${totalPages > 1 ? ` (Стор. ${page + 1}/${totalPages})` : ''}\n───────────────\n\n`
  const buttons = pageItems.map((item) => {
    const isOut = item.name.includes('(Немає)')
    const noPrice = item.price === null || item.price === undefined
    const priceLabel = noPrice ? '❔ ціна не вказана' : `💳 <b>${item.price} грн</b>`
    text += `▫️ <b>${item.name}</b> \n└ ${priceLabel} / ${item.step} ${item.unit}\n\n`

    if (isOut) return [Markup.button.callback(`❌ ${item.name} (Немає)`, 'noop')]
    if (noPrice) return [Markup.button.callback(`❔ ${item.name} (немає ціни)`, 'noop')]
    return [Markup.button.callback(`🛒 ${item.name}`, `buy_${item.id}`)]
  })

  if (totalPages > 1) {
    const navRow = []
    if (page > 0) navRow.push(Markup.button.callback('⬅️', `page_${catId}_${page - 1}`))
    navRow.push(Markup.button.callback(`${page + 1} / ${totalPages}`, 'noop'))
    if (page < totalPages - 1)
      navRow.push(Markup.button.callback('➡️', `page_${catId}_${page + 1}`))
    buttons.push(navRow)
  }

  buttons.push([Markup.button.callback('🛒 Перейти до кошика', 'view_cart')])
  buttons.push([Markup.button.callback('⬅️ Назад', backAction)])

  return { text, keyboard: Markup.inlineKeyboard(buttons) }
}

function getMainKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🍺 Напої', 'category_drinks'),
      Markup.button.callback('🥪 Закуски', 'category_food'),
    ],
    [Markup.button.callback('🛒 Мій кошик', 'view_cart')],
  ])
}

// --- 4. НАВІГАЦІЯ ТА МЕНЮ ---
bot.start((ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.session.awaitingComment = false
  ctx.session.awaitingPickupTime = false
  ctx.reply('👋 Ласкаво просимо! Оберіть категорію:', getMainKeyboard())
})

bot.action('back_to_menu', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.session.awaitingComment = false
  ctx.editMessageText('Оберіть категорію:', getMainKeyboard())
})

bot.action('category_drinks', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.editMessageText('🍺 <b>Оберіть категорію напоїв:</b>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback('🍺 Світле пиво', 'cat_light'),
        Markup.button.callback('🍺 Темне пиво', 'cat_dark'),
      ],
      [
        Markup.button.callback('✨ Особливе', 'cat_special'),
        Markup.button.callback('🍏 Сидр', 'cat_cider'),
      ],
      [Markup.button.callback('🥤 Безалкогольне', 'cat_nonAlcoholic')],
      [
        Markup.button.callback('⬅️ Головне меню', 'back_to_menu'),
        Markup.button.callback('🛒 Кошик', 'view_cart'),
      ],
    ]),
  })
})

bot.action('cat_light', (ctx) => {
  const { text, keyboard } = getCategoryMenu('light', 'СВІТЛЕ ПИВО')
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})
bot.action('cat_dark', (ctx) => {
  const { text, keyboard } = getCategoryMenu('dark', 'ТЕМНЕ ПИВО')
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})
bot.action('cat_special', (ctx) => {
  const { text, keyboard } = getCategoryMenu('special', 'ОСОБЛИВЕ СОРТОВЕ')
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})
bot.action('cat_cider', (ctx) => {
  const { text, keyboard } = getCategoryMenu('cider', 'СИДР')
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})
bot.action('cat_nonAlcoholic', (ctx) => {
  const { text, keyboard } = getCategoryMenu('nonAlcoholic', 'БЕЗАЛКОГОЛЬНЕ')
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

// "Закуски" тепер відкриває підменю: холодні закуски / гарячі закуски / соуси
bot.action('category_food', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.editMessageText('🥪 <b>Оберіть тип закусок:</b>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🥪 Закуски', 'cat_food_cold')],
      [Markup.button.callback('🔥 Гарячі закуски', 'cat_food_hot')],
      [Markup.button.callback('🧂 Соуси', 'cat_sauce')],
      [
        Markup.button.callback('⬅️ Головне меню', 'back_to_menu'),
        Markup.button.callback('🛒 Кошик', 'view_cart'),
      ],
    ]),
  })
})

bot.action('cat_food_cold', (ctx) => {
  const { text, keyboard } = getPagedCategoryMenu('food', 'ЗАКУСКИ', '🥪', 'category_food', 0)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('cat_food_hot', (ctx) => {
  const { text, keyboard } = getPagedCategoryMenu(
    'hotFood',
    'ГАРЯЧІ ЗАКУСКИ (ціна за 100г)',
    '🔥',
    'category_food',
    0
  )
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('cat_sauce', (ctx) => {
  const { text, keyboard } = getPagedCategoryMenu('sauce', 'СОУСИ', '🧂', 'category_food', 0)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

// Пагінація для будь-якої зі сторінкованих категорій: food / hotFood / sauce
bot.action(/^page_(food|hotFood|sauce)_(\d+)$/, (ctx) => {
  const catId = ctx.match[1]
  const page = parseInt(ctx.match[2], 10)
  const titles = {
    food: ['ЗАКУСКИ', '🥪'],
    hotFood: ['ГАРЯЧІ ЗАКУСКИ (ціна за 100г)', '🔥'],
    sauce: ['СОУСИ', '🧂'],
  }
  const [title, icon] = titles[catId]
  const { text, keyboard } = getPagedCategoryMenu(catId, title, icon, 'category_food', page)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('noop', (ctx) => ctx.answerCbQuery())

// --- 5. ДОДАВАННЯ В КОШИК (ОЧІКУВАННЯ ОБ'ЄМУ) ---
bot.action(/^buy_(.+)$/, (ctx) => {
  const itemId = ctx.match[1]
  const item = catalog.find((i) => i.id === itemId)

  if (!item) return ctx.answerCbQuery('Товар не знайдено 😔')
  if (item.price === null || item.price === undefined) {
    return ctx.answerCbQuery('У цього товару ще не вказана ціна 😔')
  }

  ctx.session.awaitingAmountFor = itemId
  ctx.session.awaitingComment = false

  const example = item.unit === 'л' ? '1.5' : item.unit === 'шт' ? '2' : '150'
  ctx.reply(
    `Ви обрали: <b>${item.name}</b>.\n\n✍️ Напишіть у чат бажану кількість/вагу у <b>${item.unit}</b> (наприклад: <code>${example}</code>):`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('❌ Скасувати', 'back_to_menu')]]),
    }
  )
  ctx.answerCbQuery()
})

// --- КОМЕНТАР ДО ЗАМОВЛЕННЯ ---
bot.action('add_comment', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.session.awaitingComment = true
  ctx.reply(
    ctx.session.comment
      ? `✏️ Поточний коментар: «${ctx.session.comment}»\n\nНапишіть новий текст коментаря:`
      : '✍️ Напишіть коментар до замовлення (наприклад: побажання, час доставки, номер столика):',
    {
      ...Markup.inlineKeyboard([[Markup.button.callback('❌ Скасувати', 'view_cart')]]),
    }
  )
  ctx.answerCbQuery()
})

bot.action('clear_comment', (ctx) => {
  ctx.session.comment = null
  ctx.answerCbQuery('Коментар видалено')
  renderCart(ctx, true)
})

// ОБРОБКА ТЕКСТОВОГО ВВОДУ ВІД КОРИСТУВАЧА
bot.on('text', (ctx, next) => {
  // 0) Якщо очікуємо свій час видачі (наприклад 19:30)
  if (ctx.session.awaitingPickupTime) {
    const m = ctx.message.text.trim().match(/^([01]?\d|2[0-3])[:.]([0-5]\d)$/)
    if (!m) return ctx.reply('⚠️ Невірний формат. Напишіть час так: 19:30')
    const t = Number(m[1]) * 60 + Number(m[2])
    if (t < nowMinutes()) return ctx.reply('⚠️ Цей час уже минув. Вкажіть пізніший час:')
    if (!isWithinWorkHours(t)) {
      return ctx.reply(
        `⚠️ Ми працюємо ${WORK_HOURS.open}–${WORK_HOURS.close}. Вкажіть час у цьому проміжку:`
      )
    }
    ctx.session.awaitingPickupTime = false
    ctx.session.pickup = `о ${fmtMin(t)}`
    return finalizeOrder(ctx)
  }

  // 1) Якщо очікуємо коментар до замовлення
  if (ctx.session.awaitingComment) {
    ctx.session.comment = ctx.message.text.trim()
    ctx.session.awaitingComment = false
    ctx.reply('✅ Коментар збережено!')
    return renderCart(ctx, false)
  }

  // 2) Якщо очікуємо кількість/вагу товару
  const itemId = ctx.session.awaitingAmountFor
  if (!itemId) return next()

  const item = catalog.find((i) => i.id === itemId)
  if (!item) {
    ctx.session.awaitingAmountFor = null
    return next()
  }

  const inputString = ctx.message.text.replace(',', '.')
  const amount = parseFloat(inputString)

  if (isNaN(amount) || amount <= 0) {
    return ctx.reply(`⚠️ Будь ласка, введіть коректне число:`)
  }

  // Рахуємо ціну і одразу округлюємо вгору до цілої гривні (один раз, тут).
  // toFixed(4) прибирає похибки плаваючої коми (70.00000000000001 -> 70).
  const calculatedPrice = Math.ceil(+((amount / item.step) * item.price).toFixed(4))

  ctx.session.cart.push({
    id: item.id,
    name: item.name,
    amount: amount,
    unit: item.unit,
    price: calculatedPrice,
  })

  ctx.session.awaitingAmountFor = null

  ctx.reply(
    `✅ <b>${item.name}</b> (${amount} ${item.unit}) додано в кошик!\nСума: <b>${calculatedPrice} грн</b>`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🛒 Переглянути кошик', 'view_cart')],
        [Markup.button.callback('⬅️ Продовжити покупки', 'back_to_menu')],
      ]),
    }
  )
})

// --- 6. КОШИК ТА ВІДПРАВКА ЗАМОВЛЕННЯ ---

// Формує текст і клавіатуру кошика. Використовується і з action, і після збереження коментаря.
function buildCartView(ctx) {
  const cart = ctx.session.cart || []

  if (cart.length === 0) {
    return { text: 'Ваш кошик наразі порожній 😔', keyboard: getMainKeyboard(), empty: true }
  }

  let text = '🛒 <b>ВАШ КОШИК:</b>\n───────────────\n\n'
  let totalSum = 0

  cart.forEach((item, index) => {
    text += `${index + 1}. <b>${item.name}</b>\n└ ${item.amount} ${item.unit} — 💳 <b>${item.price} грн</b>\n\n`
    totalSum += item.price
  })

  text += `───────────────\n🧾 <b>ЗАГАЛЬНА СУМА: ${totalSum} грн</b>`

  if (ctx.session.comment) {
    text += `\n💬 <b>Коментар:</b> ${esc(ctx.session.comment)}`
  }

  const buttons = [
    [
      Markup.button.callback(
        ctx.session.comment ? '✏️ Змінити коментар' : '📝 Додати коментар',
        'add_comment'
      ),
    ],
  ]
  if (ctx.session.comment) {
    buttons.push([Markup.button.callback('🗑 Видалити коментар', 'clear_comment')])
  }
  buttons.push([Markup.button.callback('✅ ОФОРМИТИ ЗАМОВЛЕННЯ', 'checkout')])
  buttons.push([Markup.button.callback('🗑 Очистити кошик', 'clear_cart')])
  buttons.push([Markup.button.callback('⬅️ До меню', 'back_to_menu')])

  return { text, keyboard: Markup.inlineKeyboard(buttons), empty: false }
}

// Виводить кошик як нове повідомлення (після введення тексту) або через edit (з callback).
function renderCart(ctx, viaEdit) {
  const { text, keyboard } = buildCartView(ctx)
  if (viaEdit) {
    return ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
  }
  return ctx.reply(text, { parse_mode: 'HTML', ...keyboard })
}

bot.action('view_cart', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.session.awaitingComment = false
  const { text, keyboard, empty } = buildCartView(ctx)
  if (empty) return ctx.editMessageText(text, keyboard)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('clear_cart', (ctx) => {
  ctx.session.cart = []
  ctx.session.comment = null
  ctx.session.pickup = null
  ctx.answerCbQuery('Кошик очищено!')
  ctx.editMessageText('Кошик очищено. Що бажаєте замовити?', getMainKeyboard())
})

// --- ОФОРМЛЕННЯ: КРОК 1 — ВИБІР ЧАСУ ВИДАЧІ ---
bot.action('checkout', async (ctx) => {
  if ((ctx.session.cart || []).length === 0) return ctx.answerCbQuery('Кошик порожній!')
  ctx.session.awaitingPickupTime = false
  await ctx.answerCbQuery()
  return ctx.editMessageText('⏰ <b>Коли заберете замовлення?</b>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback('Через 15 хв', 'pickup_15'),
        Markup.button.callback('Через 30 хв', 'pickup_30'),
        Markup.button.callback('Через 1 год', 'pickup_60'),
      ],
      [Markup.button.callback('🕐 Вказати час', 'pickup_custom')],
      [Markup.button.callback('⬅️ Назад до кошика', 'view_cart')],
    ]),
  })
})

bot.action(/^pickup_(15|30|60)$/, async (ctx) => {
  const delta = Number(ctx.match[1])
  const target = nowMinutes() + delta
  if (!isWithinWorkHours(target % 1440)) {
    return ctx.answerCbQuery(
      `Ми працюємо ${WORK_HOURS.open}–${WORK_HOURS.close}. Оберіть інший час.`,
      { show_alert: true }
    )
  }
  const label = delta === 60 ? 'через 1 год' : `через ${delta} хв`
  ctx.session.pickup = `${label} (~${fmtMin(target)})`
  await ctx.answerCbQuery()
  return finalizeOrder(ctx)
})

bot.action('pickup_custom', (ctx) => {
  ctx.session.awaitingAmountFor = null
  ctx.session.awaitingComment = false
  ctx.session.awaitingPickupTime = true
  ctx.reply('⏰ Напишіть час, коли заберете, у форматі <code>19:30</code>:', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('❌ Скасувати', 'view_cart')]]),
  })
  ctx.answerCbQuery()
})

// --- ОФОРМЛЕННЯ: КРОК 2 — ВІДПРАВКА ЗАМОВЛЕННЯ В ГРУПУ ---
async function finalizeOrder(ctx) {
  const cart = ctx.session.cart || []
  if (cart.length === 0) return ctx.reply('Кошик порожній 😔')

  const orderId = Date.now().toString(36).slice(-4).toUpperCase()
  const name = `${ctx.from.first_name || 'Клієнт'} ${ctx.from.last_name || ''}`.trim()

  let orderText = `🛍 <b>НОВЕ ЗАМОВЛЕННЯ #${orderId}</b>\n`
  orderText += `⏰ <b>Забере:</b> ${esc(ctx.session.pickup || 'не вказано')}\n`
  orderText += `👤 Покупець: ${esc(name)}\n`
  orderText += `💬 Юзернейм: ${ctx.from.username ? '@' + esc(ctx.from.username) : '<i>не вказано</i>'}\n`
  orderText += `───────────────\n`

  let totalSum = 0
  cart.forEach((item, index) => {
    orderText += `${index + 1}. <b>${esc(item.name)}</b> — ${item.amount} ${esc(item.unit)} (💳 ${item.price} грн)\n`
    totalSum += item.price
  })

  orderText += `───────────────\n🧾 <b>ВСЬОГО ДО СПЛАТИ: ${totalSum} грн</b>`

  if (ctx.session.comment) {
    orderText += `\n\n💬 <b>Коментар клієнта:</b> ${esc(ctx.session.comment)}`
  }

  try {
    // ВІДПРАВКА ЗАМОВЛЕННЯ У ГРУПУ ЗА ID (з кнопками статусів для персоналу)
    await ctx.telegram.sendMessage(process.env.GROUP_ID, orderText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('✅ Прийнято', `ord_ok_${ctx.from.id}_${orderId}`),
          Markup.button.callback('🍻 Готово', `ord_ready_${ctx.from.id}_${orderId}`),
        ],
      ]),
    })
  } catch (err) {
    console.error('Помилка відправки замовлення в групу:', err)
    return ctx.reply('❌ Не вдалося відправити замовлення. Спробуйте ще раз трохи пізніше.')
  }

  // Замовлення точно дійшло до групи — тепер очищаємо кошик, коментар і час.
  const pickup = ctx.session.pickup
  ctx.session.cart = []
  ctx.session.comment = null
  ctx.session.pickup = null

  const confirmText =
    `🎉 <b>Дякуємо! Замовлення #${orderId} відправлене.</b>\n` +
    `⏰ Заберете: ${esc(pickup || 'не вказано')}\n\n` +
    `Ми напишемо вам тут, коли воно буде прийняте та готове. Оплата на місці.`
  const opts = {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ На головну', 'back_to_menu')]]),
  }

  // Окремий try/catch: навіть якщо редагування повідомлення не вдасться
  // (наприклад, "message is not modified"), замовлення вже відправлене.
  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(confirmText, opts)
    } catch (err) {
      console.error('Замовлення відправлено, але не вдалось оновити повідомлення:', err)
      await ctx.reply(confirmText, opts).catch(() => {})
    }
  } else {
    await ctx.reply(confirmText, opts)
  }
}

// --- ОФОРМЛЕННЯ: КРОК 3 — КНОПКИ СТАТУСІВ ДЛЯ ПЕРСОНАЛУ (у групі) ---
bot.action(/^ord_(ok|ready)_(\d+)_(\w+)$/, async (ctx) => {
  const [, kind, userId, orderId] = ctx.match
  const text =
    kind === 'ok'
      ? `✅ Замовлення #${orderId} прийнято, готуємо.`
      : `🍻 Замовлення #${orderId} готове — чекаємо на вас!`

  try {
    await ctx.telegram.sendMessage(userId, text)
  } catch (err) {
    console.error('Не вдалося написати клієнту:', err)
    return ctx.answerCbQuery('⚠️ Не вдалося написати клієнту (можливо, він заблокував бота)', {
      show_alert: true,
    })
  }

  const next =
    kind === 'ok'
      ? Markup.inlineKeyboard([
          [
            Markup.button.callback('✔️ Прийнято', 'noop'),
            Markup.button.callback('🍻 Готово', `ord_ready_${userId}_${orderId}`),
          ],
        ])
      : Markup.inlineKeyboard([[Markup.button.callback('✔️ Клієнта сповіщено', 'noop')]])

  await ctx.editMessageReplyMarkup(next.reply_markup).catch(() => {})
  await ctx.answerCbQuery('Клієнту надіслано')
})

// --- ЗАПУСК ---
bot
  .launch()
  .then(() => console.log('✅ Бот успішно запущено!'))
  .catch((err) => console.error('❌ Помилка запуску бота:', err))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
