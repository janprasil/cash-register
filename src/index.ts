
const readline = require('readline');

interface ICheckout {
  scan: (item: SkuList) => void
  getTotalPrice: () => number
}

type SkuList = 'A' | 'B' | 'C' | 'D'

type PriceListType = Record<SkuList, {
  price: number
  specialPrice?: { count: number, price: number }
}>

type Country = 'u' | 'w'

type ScannedItemListType = Record<SkuList | 'BAG', { count: number, price: number }>

type BagPriceType = Record<Country, number>

const BAG_CAPACITY = 5

const PriceList: PriceListType = {
  A: { price: 50, specialPrice: { count: 3, price: 130 } },
  B: { price: 30, specialPrice: { count: 2, price: 45 } },
  C: { price: 20 },
  D: { price: 15 },
}

const BagPrice: BagPriceType = {
  u: 5,
  w: 10
}

class Checkout implements ICheckout {
  #country: Country
  #items: ScannedItemListType

  constructor(country: Country) {
    this.#country = country
    this.#items = (Object.keys(PriceList).reduce((prev, cur) => ({ ...prev, [cur]: { count: 0, price: 0 } }), { BAG: { count: 0, price: 0 } })) as ScannedItemListType
  }

  getTotalPrice = () => {
    const totalItems = Object.values(this.#items).reduce((prev, cur) => ({ count: prev.count + cur.count, price: prev.price + cur.price }), { price: 0, count: 0 })
    const bags = Math.ceil(totalItems.count / BAG_CAPACITY)
    const bagsPrice = bags * BagPrice[this.#country]

    console.log(`TOTAL ITEMS: ${totalItems.count}`)
    console.log(`TOTAL BAGS: ${bags}`)
    console.log(`TOTAL PRICE: ${totalItems.price} + ${bagsPrice} = ${totalItems.price + bagsPrice}`)
    return totalItems.price + bagsPrice
  }

  scan = (sku: SkuList) => {
    const item = PriceList[sku]
    this.#items[sku].count += 1

    if (item.specialPrice && this.#items[sku].count % item.specialPrice.count === 0) {
      this.#items[sku].price += ((-1 * (item.specialPrice.count - 1)) * item.price) + item.specialPrice.price
    } else {
      this.#items[sku].price += item.price
    }
  }
}

// PROGRAMATICAL INPUT
const cashRegister = new Checkout('u')
cashRegister.scan('A')
cashRegister.scan('A')
cashRegister.scan('A')
cashRegister.scan('A')
cashRegister.scan('A')
cashRegister.scan('B')
cashRegister.scan('B')
cashRegister.scan('B')
cashRegister.scan('C')
cashRegister.scan('D')
cashRegister.scan('D')
cashRegister.getTotalPrice()
process.exit(0)

// Uncomment FOR CLI Input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Your country: [u] UK / [w] Wales\n', (country: string) => {
//   if (country !== 'u' && country !== 'w') {
//     console.log('Bad country')
//     process.exit(0);
//   }

//   const cashRegister = new Checkout(country)

//   const askForItem = () => rl.question('What next? [A,B,C,D,Q] (Q = checkout) \n', (sku: string) => {
//     if (PriceList[sku as SkuList]) {
//       cashRegister.scan(sku as SkuList)
//     } else if (sku === 'Q') {
//       cashRegister.getTotalPrice()
//       process.exit(0)
//     } else {
//       console.log('Goods not found')
//     }
//     askForItem()
//   })
//   askForItem()
// })
