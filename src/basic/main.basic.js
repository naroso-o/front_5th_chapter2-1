import CartPage from './components/cart-page'
import MOCK_PRODUCT_LIST from './mock/product'

let lastSelectedItem

function main() {
    var root = document.getElementById('app')
    root.innerHTML = CartPage()

    updateProductsPrice()
    calculateCart()

    setTimeout(function () {
        setInterval(function () {
            var luckyItem =
                MOCK_PRODUCT_LIST[
                    Math.floor(Math.random() * MOCK_PRODUCT_LIST.length)
                ]
            if (Math.random() < 0.3 && luckyItem.stock > 0) {
                luckyItem.price = Math.round(luckyItem.price * 0.8)
                alert(
                    '번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!'
                )
                updateProductsPrice()
            }
        }, 30000)
    }, Math.random() * 10000)

    setTimeout(function () {
        setInterval(function () {
            if (lastSelectedItem) {
                var suggest = MOCK_PRODUCT_LIST.find(function (item) {
                    return item.id !== lastSelectedItem && item.stock > 0
                })
                if (suggest) {
                    alert(
                        suggest.name +
                            '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
                    )
                    suggest.price = Math.round(suggest.vpriceal * 0.95)
                    updateProductsPrice()
                }
            }
        }, 60000)
    }, Math.random() * 20000)
}

function updateProductsPrice() {
    const sel = document.getElementById('product-select')
    sel.innerHTML = ''
    MOCK_PRODUCT_LIST.forEach(function (item) {
        var opt = document.createElement('option')
        opt.value = item.id
        opt.textContent = item.name + ' - ' + item.price + '원'
        if (item.stock === 0) opt.disabled = true
        sel.appendChild(opt)
    })
}

function calculateCart() {
    const sum = document.getElementById('cart-total')
    const cartContainer = document.getElementById('cart-items')

    let totalPrice = 0
    let totalItemCount = 0

    var cartItems = cartContainer.children
    var subTot = 0

    for (var i = 0; i < cartItems.length; i++) {
        ;(function () {
            var currentItem
            for (var j = 0; j < MOCK_PRODUCT_LIST.length; j++) {
                if (MOCK_PRODUCT_LIST[j].id === cartItems[i].id) {
                    currentItem = MOCK_PRODUCT_LIST[j]
                    break
                }
            }
            var itemQuantity = parseInt(
                cartItems[i].querySelector('span').textContent.split('x ')[1]
            )
            var itemTotalPrice = currentItem.price * itemQuantity
            var disc = 0
            totalItemCount += itemQuantity
            subTot += itemTotalPrice
            if (itemQuantity >= 10) {
                if (currentItem.id === 'p1') disc = 0.1
                else if (currentItem.id === 'p2') disc = 0.15
                else if (currentItem.id === 'p3') disc = 0.2
                else if (currentItem.id === 'p4') disc = 0.05
                else if (currentItem.id === 'p5') disc = 0.25
            }
            totalPrice += itemTotalPrice * (1 - disc)
        })()
    }
    let discountRate = 0
    if (totalItemCount >= 30) {
        var bulkDisc = totalPrice * 0.25
        var itemDisc = subTot - totalPrice
        if (bulkDisc > itemDisc) {
            totalPrice = subTot * (1 - 0.25)
            discountRate = 0.25
        } else {
            discountRate = (subTot - totalPrice) / subTot
        }
    } else {
        discountRate = (subTot - totalPrice) / subTot
    }
    if (new Date().getDay() === 2) {
        totalPrice *= 1 - 0.1
        discountRate = Math.max(discountRate, 0.1)
    }
    sum.textContent = '총액: ' + Math.round(totalPrice) + '원'
    if (discountRate > 0) {
        var span = document.createElement('span')
        span.className = 'text-green-500 ml-2'
        span.textContent =
            '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)'
        sum.appendChild(span)
    }
    updateProductsStock()
    updateBonusPoints(totalPrice)
}

const updateBonusPoints = (totalPrice) => {
    const sum = document.getElementById('cart-total')
    var ptsTag = document.getElementById('loyalty-points')

    const bonusPoints = Math.floor(totalPrice / 1000) || 0

    if (!ptsTag) {
        ptsTag = document.createElement('span')
        ptsTag.id = 'loyalty-points'
        ptsTag.className = 'text-blue-500 ml-2'
        sum.appendChild(ptsTag)
    }
    ptsTag.textContent = '(포인트: ' + bonusPoints + ')'
}

function updateProductsStock() {
    const stockInfo = document.getElementById('stock-status')
    var infoMsg = ''
    MOCK_PRODUCT_LIST.forEach(function (item) {
        if (item.stock < 5) {
            infoMsg +=
                item.name +
                ': ' +
                (item.stock > 0
                    ? '재고 부족 (' + item.stock + '개 남음)'
                    : '품절') +
                '\n'
        }
    })
    stockInfo.textContent = infoMsg
}

main()

const addItemButton = document.getElementById('add-to-cart')
const cartContainer = document.getElementById('cart-items')
const productSelect = document.getElementById('product-select')

addItemButton.addEventListener('click', function () {
    var selectedItem = productSelect.value
    var itemToAdd = MOCK_PRODUCT_LIST.find(function (product) {
        return product.id === selectedItem
    })
    if (itemToAdd && itemToAdd.stock > 0) {
        var item = document.getElementById(itemToAdd.id)
        if (item) {
            var newItemCount =
                parseInt(
                    item.querySelector('span').textContent.split('x ')[1]
                ) + 1
            if (newItemCount <= itemToAdd.stock) {
                item.querySelector('span').textContent =
                    itemToAdd.name +
                    ' - ' +
                    itemToAdd.price +
                    '원 x ' +
                    newItemCount
                itemToAdd.stock--
            } else {
                alert('재고가 부족합니다.')
            }
        } else {
            var newItem = document.createElement('div')
            newItem.id = itemToAdd.id
            newItem.className = 'flex justify-between items-center mb-2'
            newItem.innerHTML =
                '<span>' +
                itemToAdd.name +
                ' - ' +
                itemToAdd.price +
                '원 x 1</span><div>' +
                '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
                itemToAdd.id +
                '" data-change="-1">-</button>' +
                '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
                itemToAdd.id +
                '" data-change="1">+</button>' +
                '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
                itemToAdd.id +
                '">삭제</button></div>'
            cartContainer.appendChild(newItem)
            itemToAdd.stock--
        }
        calculateCart()
        lastSelectedItem = selectedItem
    }
})
cartContainer.addEventListener('click', function (event) {
    var target = event.target
    if (
        target.classList.contains('quantity-change') ||
        target.classList.contains('remove-item')
    ) {
        var prodId = target.dataset.productId
        var itemElem = document.getElementById(prodId)
        var prod = MOCK_PRODUCT_LIST.find(function (p) {
            return p.id === prodId
        })
        if (target.classList.contains('quantity-change')) {
            var qtyChange = parseInt(target.dataset.change)
            var newItemCount =
                parseInt(
                    itemElem.querySelector('span').textContent.split('x ')[1]
                ) + qtyChange
            if (
                newItemCount > 0 &&
                newItemCount <=
                    prod.stock +
                        parseInt(
                            itemElem
                                .querySelector('span')
                                .textContent.split('x ')[1]
                        )
            ) {
                itemElem.querySelector('span').textContent =
                    itemElem.querySelector('span').textContent.split('x ')[0] +
                    'x ' +
                    newItemCount
                prod.stock -= qtyChange
            } else if (newItemCount <= 0) {
                itemElem.remove()
                prod.stock -= qtyChange
            } else {
                alert('재고가 부족합니다.')
            }
        } else if (target.classList.contains('remove-item')) {
            var remQty = parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1]
            )
            prod.stock += remQty
            itemElem.remove()
        }
        calculateCart()
    }
})
