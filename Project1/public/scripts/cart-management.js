const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

async function addToCart() {
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;

    let response;
    try{
        response = await fetch("/cart/items", {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            _csrf: csrfToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
    }catch(error){
        alert('무언가 잘못됨');
        return;
    }

    if(!response.ok){
        alert('무언가 잘못되었습니다');
        return;
    }

    //처리 완료 수신
    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    cartBadgeElement.textContent = newTotalQuantity;
}

addToCartButtonElement.addEventListener("click", addToCart);