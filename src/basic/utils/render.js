export const updateTotalPriceAndPoints = (totalPrice, discountRate) => {
    const $cartTotal = document.getElementById('cart-total');

    // totalPrice를 화면에 반영합니다.
    $cartTotal.textContent = '총액: ' + Math.round(totalPrice) + '원';
    if (discountRate > 0) {
        const span = document.createElement('span');
        span.className = 'text-green-500 ml-2';
        span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
        $cartTotal.appendChild(span);
    }

    // totalPrice에 대한 보너스 포인트를 계산하고 화면에 반영합니다.
    let $pointTag = document.getElementById('loyalty-points');
    const bonusPoints = Math.floor(totalPrice / 1000) || 0;

    if (!$pointTag) {
        $pointTag = document.createElement('span');
        $pointTag.id = 'loyalty-points';
        $pointTag.className = 'text-blue-500 ml-2';
        $cartTotal.appendChild($pointTag);
    }
    $pointTag.textContent = '(포인트: ' + bonusPoints + ')';
}
