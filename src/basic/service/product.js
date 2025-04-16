import MOCK_PRODUCT_LIST from '../mock/product'
let lastSelectedItem

/** 전체 상품 가격을 업데이트하여 화면에 반영합니다. */
export const updateProductsPrice = () => {
    const sel = document.getElementById('product-select')
    sel.innerHTML = ''
    MOCK_PRODUCT_LIST.forEach(function (item) {
        let opt = document.createElement('option')
        opt.value = item.id
        opt.textContent = item.name + ' - ' + item.price + '원'
        if (item.stock === 0) opt.disabled = true
        sel.appendChild(opt)
    })
}

/** 전체 상품 재고를 업데이트하여 화면에 반영합니다. */
export const updateProductsStock = () => {
    const stockInfo = document.getElementById('stock-status')
    let infoMsg = ''
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

/** 랜덤 럭키 상품을 선정하여 세일합니다. */
export const updateLuckyItemSale = () => {
    let luckyItem =
        MOCK_PRODUCT_LIST[Math.floor(Math.random() * MOCK_PRODUCT_LIST.length)]
    if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8)
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!')
        updateProductsPrice()
    }
}

/** 고객이 마지막으로 선택한 상품을 세일합니다. */
export const updateLastSelectedSale = () => {
    if (lastSelectedItem) {
        let suggest = MOCK_PRODUCT_LIST.find(function (item) {
            return item.id !== lastSelectedItem && item.stock > 0
        })
        if (suggest) {
            alert(
                suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
            )
            suggest.price = Math.round(suggest.vpriceal * 0.95)
            updateProductsPrice()
        }
    }
}

/** 고객이 마지막으로 선택한 상품을 업데이트합니다. */
export const updateLastSelectedItem = (item) => {
    if (!item) {
        localStorage.removeItem('lastSelectedItem')
    }
    localStorage.setItem('lastSelectedItem', item)
}
