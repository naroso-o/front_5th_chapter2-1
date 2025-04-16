import CartPage from './page/cart-page'
import MOCK_PRODUCT_LIST from './mock/product'
import {
    updateLuckyItemSale,
    updateProductsPrice,
    updateLastSelectedSale,
    updateLastSelectedItem
} from './service/product'
import { calculateCart } from './service/cart'

function main() {
    var root = document.getElementById('app')
    root.innerHTML = CartPage()

    updateLastSelectedItem()
    updateProductsPrice()
    calculateCart()

    // 랜덤 럭키 상품 세일을 Interval로 등록합니다.
    setTimeout(function () {
        setInterval(updateLuckyItemSale(), 30000)
    }, Math.random() * 10000)

    // 마지막 선택 상품 세일을 Interval로 등록합니다.
    setTimeout(function () {
        setInterval(updateLastSelectedSale(), 60000)
    }, Math.random() * 20000)
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
        updateLastSelectedItem(selectedItem)
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
