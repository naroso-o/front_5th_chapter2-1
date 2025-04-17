import { updateProductsStock } from './product';
import MOCK_PRODUCT_LIST from '../mock/product';

/**
 * - 카트에 담긴 상품들의 총 가격을 화면에 반영합니다.
 * - 총 가격에 대한 보너스 포인트 함수를 호출합니다.
 * */
export const calculateCart = () => {
    const sum = document.getElementById('cart-total');
    const cartContainer = document.getElementById('cart-items');

    let totalPrice = 0;
    let totalItemCount = 0;

    const cartItems = cartContainer.children;
    let subTot = 0;

    for (let i = 0; i < cartItems.length; i++) {
        (function () {
            let currentItem;
            for (let j = 0; j < MOCK_PRODUCT_LIST.length; j++) {
                if (MOCK_PRODUCT_LIST[j].id === cartItems[i].id) {
                    currentItem = MOCK_PRODUCT_LIST[j];
                    break;
                }
            }
            const itemQuantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
            const itemTotalPrice = currentItem.price * itemQuantity;
            let disc = 0;
            totalItemCount += itemQuantity;
            subTot += itemTotalPrice;
            if (itemQuantity >= 10) {
                if (currentItem.id === 'p1') {
                    disc = 0.1;
                } else if (currentItem.id === 'p2') {
                    disc = 0.15;
                } else if (currentItem.id === 'p3') {
                    disc = 0.2;
                } else if (currentItem.id === 'p4') {
                    disc = 0.05;
                } else if (currentItem.id === 'p5') {
                    disc = 0.25;
                }
            }
            totalPrice += itemTotalPrice * (1 - disc);
        })();
    }
    let discountRate = 0;
    if (totalItemCount >= 30) {
        const bulkDisc = totalPrice * 0.25;
        const itemDisc = subTot - totalPrice;
        if (bulkDisc > itemDisc) {
            totalPrice = subTot * (1 - 0.25);
            discountRate = 0.25;
        } else {
            discountRate = (subTot - totalPrice) / subTot;
        }
    } else {
        discountRate = (subTot - totalPrice) / subTot;
    }
    if (new Date().getDay() === 2) {
        totalPrice *= 1 - 0.1;
        discountRate = Math.max(discountRate, 0.1);
    }
    sum.textContent = '총액: ' + Math.round(totalPrice) + '원';
    if (discountRate > 0) {
        const span = document.createElement('span');
        span.className = 'text-green-500 ml-2';
        span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
        sum.appendChild(span);
    }
    updateProductsStock();
    updateBonusPoints(totalPrice);
};

/** totalPrice에 대한 보너스 포인트를 계산하고 화면에 반영합니다. */
export const updateBonusPoints = (totalPrice) => {
    const sum = document.getElementById('cart-total');
    let ptsTag = document.getElementById('loyalty-points');

    const bonusPoints = Math.floor(totalPrice / 1000) || 0;

    if (!ptsTag) {
        ptsTag = document.createElement('span');
        ptsTag.id = 'loyalty-points';
        ptsTag.className = 'text-blue-500 ml-2';
        sum.appendChild(ptsTag);
    }
    ptsTag.textContent = '(포인트: ' + bonusPoints + ')';
};
