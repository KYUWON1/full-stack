const cartItemUpdateFormElement = document.querySelectorAll(
  ".cart-item-management"
);
const cartTotalPriceElement = document.getElementById("cart-total-price");
const cartBadge = document.querySelector(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  //cart 컨트롤러에서 추출함
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("무엇가 잘못되었습니다");
    return;
  }

  if (!response.ok) {
    alert("무엇가 잘못되었습니다");
    return;
  }

  const responseData = await response.json();

  if(responseData.updateCartData.updateItemPrice === 0){
    form.parentElement.parentElement.remove();
  }else {
     const cartItemTotalPriceElement =
       form.parentElement.querySelector(".cart-item-price");
       cartItemTotalPriceElement.textContent =
         responseData.updateCartData.updateItemPrice;
  }

  cartTotalPriceElement.textContent = responseData.updateCartData.newTotalPrice;
 
  cartBadge.textContent = responseData.updateCartData.newTotalQuantity;
}

for (const formElement of cartItemUpdateFormElement) {
  formElement.addEventListener("submit", updateCartItem);
}
