const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open'); // class='open' 이 추가됫다없어졌다함
}

mobileMenuBtnElement.addEventListener("click", toggleMobileMenu);