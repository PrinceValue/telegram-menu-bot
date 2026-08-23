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
    desc: "Світле нефільтроване",
  },
  {
    id: 'd19',
    name: 'Віденське',
    price: 57,
    step: 0.5,
    unit: 'л',
    cat: 'light',
    desc: "Cвітле",
  },

  // --- ЗАКУСКИ (Повний список) ---
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
  {
    id: 'f22',
    name: 'Кукурудза «мед/гірчиця» (Немає)',
    price: 34,
    step: 50,
    unit: 'г',
    cat: 'food',
  },
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
  { id: 'f37', name: 'Чіпси курячі «Пармезан»', price: 84, step: 50, unit: 'г', cat: 'food' },
]

const bot = new Telegraf(process.env.BOT_TOKEN)

// --- 3. СЕСІЇ ДЛЯ КОШИКА ТА СТАНУ ---
bot.use(session({ defaultSession: () => ({ cart: [], awaitingAmountFor: null }) }))

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

function getFoodPage(page = 0) {
  const foodItems = catalog.filter((i) => i.cat === 'food')
  const totalPages = Math.ceil(foodItems.length / ITEMS_PER_PAGE)
  const start = page * ITEMS_PER_PAGE
  const items = foodItems.slice(start, start + ITEMS_PER_PAGE)

  let text = `🥪 <b>ЗАКУСКИ (Стор. ${page + 1}/${totalPages})</b>\n───────────────\n\n`
  const buttons = items.map((item) => {
    const isOut = item.name.includes('(Немає)')
    text += `▫️ <b>${item.name}</b> \n└ 💳 <b>${item.price} грн</b> / ${item.step} ${item.unit}\n\n`

    if (isOut) return [Markup.button.callback(`❌ ${item.name} (Немає)`, 'noop')]
    return [Markup.button.callback(`🛒 ${item.name}`, `buy_${item.id}`)]
  })

  const navRow = []
  if (page > 0) navRow.push(Markup.button.callback('⬅️', `food_page_${page - 1}`))
  navRow.push(Markup.button.callback(`${page + 1} / ${totalPages}`, 'noop'))
  if (page < totalPages - 1) navRow.push(Markup.button.callback('➡️', `food_page_${page + 1}`))

  buttons.push(navRow)
  buttons.push([Markup.button.callback('🛒 Перейти до кошика', 'view_cart')])
  buttons.push([Markup.button.callback('⬅️ Головне меню', 'back_to_menu')])

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
  ctx.reply('👋 Ласкаво просимо! Оберіть категорію:', getMainKeyboard())
})

bot.action('back_to_menu', (ctx) => {
  ctx.session.awaitingAmountFor = null
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

bot.action('category_food', (ctx) => {
  ctx.session.awaitingAmountFor = null
  const { text, keyboard } = getFoodPage(0)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action(/^food_page_(\d+)$/, (ctx) => {
  const page = parseInt(ctx.match[1], 10)
  const { text, keyboard } = getFoodPage(page)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('noop', (ctx) => ctx.answerCbQuery())

// --- 5. ДОДАВАННЯ В КОШИК (ОЧІКУВАННЯ ОБ'ЄМУ) ---
bot.action(/^buy_(.+)$/, (ctx) => {
  const itemId = ctx.match[1]
  const item = catalog.find((i) => i.id === itemId)

  if (!item) return ctx.answerCbQuery('Товар не знайдено 😔')

  ctx.session.awaitingAmountFor = itemId

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

// ОБРОБКА ТЕКСТОВОГО ВВОДУ ВІД КОРИСТУВАЧА
bot.on('text', (ctx, next) => {
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

  // Рахуємо ціну. Якщо це штучний товар (шт) - просто множимо
  const calculatedPrice = (amount / item.step) * item.price

  ctx.session.cart.push({
    id: item.id,
    name: item.name,
    amount: amount,
    unit: item.unit,
    price: calculatedPrice,
  })

  ctx.session.awaitingAmountFor = null

  ctx.reply(
    `✅ <b>${item.name}</b> (${amount} ${item.unit}) додано в кошик!\nСума: <b>${Math.ceil(calculatedPrice)} грн</b>`,
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
bot.action('view_cart', (ctx) => {
  ctx.session.awaitingAmountFor = null
  const cart = ctx.session.cart || []

  if (cart.length === 0) {
    return ctx.editMessageText('Ваш кошик наразі порожній 😔', getMainKeyboard())
  }

  let text = '🛒 <b>ВАШ КОШИК:</b>\n───────────────\n\n'
  let totalSum = 0

  cart.forEach((item, index) => {
    text += `${index + 1}. <b>${item.name}</b>\n└ ${item.amount} ${item.unit} — 💳 <b>${Math.ceil(item.price)} грн</b>\n\n`
    totalSum += item.price
  })

  text += `───────────────\n🧾 <b>ЗАГАЛЬНА СУМА: ${Math.ceil(totalSum)} грн</b>`

  ctx.editMessageText(text, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('✅ ОФОРМИТИ ЗАМОВЛЕННЯ', 'checkout')],
      [Markup.button.callback('🗑 Очистити кошик', 'clear_cart')],
      [Markup.button.callback('⬅️ До меню', 'back_to_menu')],
    ]),
  })
})

bot.action('clear_cart', (ctx) => {
  ctx.session.cart = []
  ctx.answerCbQuery('Кошик очищено!')
  ctx.editMessageText('Кошик очищено. Що бажаєте замовити?', getMainKeyboard())
})

bot.action('checkout', async (ctx) => {
  const cart = ctx.session.cart || []
  if (cart.length === 0) return ctx.answerCbQuery('Кошик порожній!')

  // Формуємо текст замовлення
  let orderText = `🛍 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n`
  orderText += `👤 Покупець: ${ctx.from.first_name || 'Клієнт'} ${ctx.from.last_name || ''}\n`
  orderText += `💬 Юзернейм: ${ctx.from.username ? '@' + ctx.from.username : '<i>не вказано</i>'}\n`
  orderText += `───────────────\n`

  let totalSum = 0
  cart.forEach((item, index) => {
    orderText += `${index + 1}. <b>${item.name}</b> — ${item.amount} ${item.unit} (💳 ${Math.ceil(item.price)} грн)\n`
    totalSum += item.price
  })

  orderText += `───────────────\n🧾 <b>ВСЬОГО ДО СПЛАТИ: ${Math.ceil(totalSum)} грн</b>`

  try {
    // ВІДПРАВКА ЗАМОВЛЕННЯ У ГРУПУ ЗА ID
    await ctx.telegram.sendMessage(process.env.GROUP_ID, orderText, { parse_mode: 'HTML' })

    // Очищаємо кошик після успішного оформлення
    ctx.session.cart = []

    ctx.editMessageText(
      "🎉 <b>Дякуємо за замовлення!</b>\n\nВоно вже відправлене. Наш менеджер зв'яжеться з вами найближчим часом.",
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ На головну', 'back_to_menu')]]),
      }
    )
  } catch (err) {
    console.error('Помилка відправки замовлення:', err)
    ctx.answerCbQuery('❌ Помилка. Перевірте, чи додано бота до групи та чи має він права.')
  }
})

// --- ЗАПУСК ---
bot
  .launch()
  .then(() => console.log('✅ Бот успішно запущено!'))
  .catch((err) => console.error('❌ Помилка запуску бота:', err))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
