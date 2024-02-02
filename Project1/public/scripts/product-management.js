const deleteProductBtnElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
    const BtnElement = event.target; // 이미 버튼이 클릭된다는 이벤트를 알고있음
    const productId = BtnElement.dataset.productid; // data-에 접근
    const csrfToken = BtnElement.dataset.csrf;

    //마차가지로 토큰 전달되어야함
    const response = await fetch("/admin/products/" + productId + "?_csrf=" + csrfToken, {
      method: "DELETE",
    }); //post delete요청 보내는데 사용가능

    if(!response.ok){
        alert('무언가 잘못되었습니다!');
        return;
    }

    //product item 스크립트의 버튼의 부모의 부모의 부모 article
    //해당 부모에 접근해서 remove() 삭제 !
    BtnElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for(const deleteProductBtnElement of deleteProductBtnElements) {
    deleteProductBtnElement.addEventListener("click", deleteProduct);
}