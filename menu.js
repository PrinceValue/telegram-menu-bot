require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const http = require('http')

const PORT = process.env.PORT || 3000
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Bot is alive!')
  })
  .listen(PORT, () => console.log(`🌐 HTTP-сервер запущен на порту ${PORT}`))

const bot = new Telegraf(process.env.BOT_TOKEN)

const menuData = {
  drinks: {
    light: `🍺 <b>СВІТЛЕ ПИВО</b>
───────────────

▫️ <b>Бланш</b> <code>[ 0.5 л ]</code>
└ 💳 <b>86 грн</b> • <i>Пшеничне нефільтроване</i> 🌾

▫️ <b>Чеський лагер</b> <code>[ 0.5 л ]</code>
└ 💳 <b>50 грн</b> • <i>Класичний світлий хміль</i>

▫️ <b>Світле медове</b> <code>[ 0.5 л ]</code>
└ 💳 <b>67 грн</b> • <i>Приємна медова нотка</i> 🍯

▫️ <b>Князь Сангушко</b> <code>[ 0.5 л ]</code>
└ 💳 <b>84 грн</b> • <i>Живе та витримане</i> ⭐

▫️ <b>Опілля</b> <code>[ 0.5 л ]</code>
└ 💳 <b>57 грн</b> • <i>Традиційне світле</i>

▫️ <b>Павлівське</b> <code>[ 0.5 л ]</code>
└ 💳 <b>50 грн</b> • <i>Легке та освіжаюче</i>`,

    dark: `🍺 <b>ТЕМНЕ ПИВО</b>
───────────────

▫️ <b>Темне медове</b> <code>[ 0.5 л ]</code>
└ 💳 <b>67 грн</b> • <i>Оксамитовий смак з медом</i> 🍯

▫️ <b>Original Dark</b> <code>[ 0.5 л ]</code>
└ 💳 <b>53 грн</b> • <i>Насичене солодове</i> 🍫`,

    special: `✨ <b>ОСОБЛИВЕ СОРТОВЕ</b>
───────────────

▫️ <b>IPA</b> <code>[ 0.5 л ]</code>
└ 💳 <b>75 грн</b> • <i>Яскрава хмелева гірчинка</i> 🌿`,

    cider: `🍏 <b>СИДР</b>
───────────────

▫️ <b>Фраголіно</b> <code>[ 0.5 л ]</code>
└ 💳 <b>90 грн</b> • <i>Зі смаком полуниці</i> 🍓

▫️ <b>Сидр Яблуко-Диня</b> <code>[ 0.5 л ]</code>
└ 💳 <b>48 грн</b> • <i>Фруктовий мікс</i> 🍈

▫️ <b>Сидр Яблуко</b> <code>[ 0.5 л ]</code>
└ 💳 <b>48 грн</b> • <i>Освіжаючий класичний</i> 🍎

▫️ <b>Сидр Шовковиця</b> <code>[ 0.5 л ]</code>
└ 💳 <b>48 грн</b> • <i>Ягідний та ароматний</i> 🫐`,

    nonAlcoholic: `🥤 <b>БЕЗАЛКОГОЛЬНЕ</b>
───────────────

▫️ <b>Квас</b> <code>[ 0.5 л ]</code>
└ 💳 <b>36 грн</b> • <i>Традиційний хлібний</i> 🌾

▫️ <b>Мохіто</b> <code>[ 0.5 л ]</code>
└ 💳 <b>32 грн</b> • <i>М'ята та лайм</i> 🍃`,
  },
}

const foodList = [
  '▫️ <b>Анчоус</b> <code>[ 50 г ]</code>\n└ 💳 <b>55 грн</b>',
  '▫️ <b>Арахіс зі смаком бекону</b> <code>[ 50 г ]</code>\n└ 💳 <b>23 грн</b>',
  '▫️ <b>Арахіс зі смаком сиру</b> <code>[ 50 г ]</code>\n└ 💳 <b>23 грн</b>',
  '▫️ <b>Вуха свині вагові</b> <code>[ 50 г ]</code>\n└ 💳 <b>31 грн</b>',
  '▫️ <b>Вуха свині вагові «Рикун»</b> <code>[ 50 г ]</code>\n└ 💳 <b>35 грн</b>',
  '▫️ <b>Грінки хвилясті зі смаком сиру</b> <code>[ 50 г ]</code>\n└ 💳 <b>29 грн</b>',
  '▫️ <b>Грінки фірмові з часником</b> <code>[ 50 г ]</code>\n└ 💳 <b>29 грн</b>',
  '▫️ <b>Грінки фірмові холодець з хріном</b> <code>[ 50 г ]</code>\n└ 💳 <b>29 грн</b>',
  '▫️ <b>Джерки курячі гострі</b> <code>[ 50 г ]</code>\n└ 💳 <b>67 грн</b>',
  '▫️ <b>Жовтий смугастик</b> <code>[ 50 г ]</code>\n└ 💳 <b>68 грн</b>',
  '▫️ <b>Закарпацькі ковбаски «Kabanosy»</b> <code>[ 1 шт ]</code>\n└ 💳 <b>127 грн</b>',
  '▫️ <b>Закарпацькі ковбаски «Parmesano» вагові</b> <code>[ 50 г ]</code>\n└ 💳 <b>57 грн</b>',
  '▫️ <b>Закарпацькі ковбаски «Spicy»</b> <code>[ 1 шт ]</code>\n└ 💳 <b>253 грн</b>',
  '▫️ <b>Ікра Корюшки</b> <code>[ 50 г ]</code>\n└ 💳 <b>149 грн</b> *немає в наявності*',
  '▫️ <b>Ікра судака</b> <code>[ 50 г ]</code>\n└ 💳 <b>108 грн</b>',
  '▫️ <b>Ікра тарані</b> <code>[ 50 г ]</code>\n└ 💳 <b>149 грн</b>',
  '▫️ <b>Кільце кальмара</b> <code>[ 50 г ]</code>\n└ 💳 <b>81 грн</b>',
  '▫️ <b>Корюшка з ікрою</b> <code>[ 50 г ]</code>\n└ 💳 <b>92 грн</b>',
  '▫️ <b>Кранч (васабі / сир / бекон)</b> <code>[ 50 г ]</code>\n└ 💳 <b>24 грн</b>',
  '▫️ <b>Кріспі мікс смаків</b> <code>[ 50 г ]</code>\n└ 💳 <b>27 грн</b>',
  '▫️ <b>Кукурудза барбекю</b> <code>[ 50 г ]</code>\n└ 💳 <b>34 грн</b>',
  '▫️ <b>Кукурудза «мед / гірчиця»</b> <code>[ 50 г ]</code>\n└ 💳 <b>34 грн</b> *немає в наявності*',
  '▫️ <b>Курка «Халяль» (теріякі)</b> <code>[ 50 г ]</code>\n└ 💳 <b>75 грн</b> *немає в наявності*',
  '▫️ <b>Курка «Халяль» (часник)</b> <code>[ 50 г ]</code>\n└ 💳 <b>75 грн</b>',
  '▫️ <b>Курка «Халяль» (чілі)</b> <code>[ 50 г ]</code>\n└ 💳 <b>75 грн</b>',
  '▫️ <b>Мідія сушена</b> <code>[ 50 г ]</code>\n└ 💳 <b>102 грн</b>',
  '▫️ <b>Охотський посол</b> <code>[ 50 г ]</code>\n└ 💳 <b>63 грн</b>',
  '▫️ <b>Паутинка кальмара червона</b> <code>[ 50 г ]</code>\n└ 💳 <b>88 грн</b>',
  '▫️ <b>Свинина хамон ТМ «Теплі моря»</b> <code>[ 50 г ]</code>\n└ 💳 <b>98 грн</b>',
  '▫️ <b>Сир копчений сулугуні (бекон)</b> <code>[ 50 г ]</code>\n└ 💳 <b>33 грн</b>',
  '▫️ <b>Соломка лосося сушена</b> <code>[ 50 г ]</code>\n└ 💳 <b>48 грн</b>',
  '▫️ <b>Стружка кальмара звичайна</b> <code>[ 50 г ]</code>\n└ 💳 <b>80 грн</b>',
  '▫️ <b>Стружка кальмара (краб)</b> <code>[ 50 г ]</code>\n└ 💳 <b>80 грн</b>',
  '▫️ <b>Тарань ікряна</b> <code>[ 50 г ]</code>\n└ 💳 <b>95 грн</b>',
  '▫️ <b>Фісташка</b> <code>[ 50 г ]</code>\n└ 💳 <b>78 грн</b>',
  '▫️ <b>Чіпси курячі «духмяний перець»</b> <code>[ 50 г ]</code>\n└ 💳 <b>84 грн</b>',
  '▫️ <b>Чіпси курячі «Пармезан»</b> <code>[ 50 г ]</code>\n└ 💳 <b>84 грн</b>',
]

const ITEMS_PER_PAGE = 10

function getFoodPage(page = 0) {
  const totalPages = Math.ceil(foodList.length / ITEMS_PER_PAGE)
  const start = page * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const items = foodList.slice(start, end)

  const text = `🥪 <b>ЗАКУСКИ (Стор. ${page + 1}/${totalPages})</b>\n───────────────\n\n${items.join('\n\n')}`

  const navRow = []
  if (page > 0) {
    navRow.push(Markup.button.callback('⬅️', `food_page_${page - 1}`))
  }
  navRow.push(Markup.button.callback(`${page + 1} / ${totalPages}`, 'noop'))
  if (page < totalPages - 1) {
    navRow.push(Markup.button.callback('➡️', `food_page_${page + 1}`))
  }

  const keyboard = Markup.inlineKeyboard([
    navRow,
    [Markup.button.callback('⬅️ Назад в головне меню', 'back_to_menu')],
  ])

  return { text, keyboard }
}

bot.start((ctx) => {
  ctx.reply(
    'Ласкаво просимо! Оберіть категорію:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🍺 Напої', 'category_drinks')],
      [Markup.button.callback('🥪 Закуски', 'category_food')],
    ])
  )
})

bot.action('category_drinks', (ctx) => {
  ctx.editMessageText('🍺 <b>Оберіть категорію напоїв:</b>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🍺 Світле пиво', 'drink_light')],
      [Markup.button.callback('🍺 Темне пиво', 'drink_dark')],
      [Markup.button.callback('✨ Особливе', 'drink_special')],
      [Markup.button.callback('🍏 Сидр', 'drink_cider')],
      [Markup.button.callback('🥤 Безалкогольне', 'drink_na')],
      [Markup.button.callback('⬅️ Назад в головне меню', 'back_to_menu')],
    ]),
  })
})

bot.action('drink_light', (ctx) => {
  ctx.editMessageText(menuData.drinks.light, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')]]),
  })
})

bot.action('drink_dark', (ctx) => {
  ctx.editMessageText(menuData.drinks.dark, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')]]),
  })
})

bot.action('drink_special', (ctx) => {
  ctx.editMessageText(menuData.drinks.special, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')]]),
  })
})

bot.action('drink_cider', (ctx) => {
  ctx.editMessageText(menuData.drinks.cider, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')]]),
  })
})

bot.action('drink_na', (ctx) => {
  ctx.editMessageText(menuData.drinks.nonAlcoholic, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад до напоїв', 'category_drinks')]]),
  })
})

bot.action('category_food', (ctx) => {
  const { text, keyboard } = getFoodPage(0)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action(/^food_page_(\d+)$/, (ctx) => {
  const page = parseInt(ctx.match[1], 10)
  const { text, keyboard } = getFoodPage(page)
  ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard })
})

bot.action('noop', (ctx) => ctx.answerCbQuery())

bot.action('back_to_menu', (ctx) => {
  ctx.editMessageText(
    'Оберіть категорію:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🍺 Напої', 'category_drinks')],
      [Markup.button.callback('🥪 Закуски', 'category_food')],
    ])
  )
})

bot
  .launch()
  .then(() => console.log('✅ Бот успешно запущен!'))
  .catch((err) => console.error('❌ Ошибка:', err))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
