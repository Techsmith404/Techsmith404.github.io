let menuOpen = false;
let menu = document.getElementById.("menu");

function expand() {
  if (menuOpen != true) { 
    menu.style.animation="menuOpen 1s forwards";
    menuOpen = true;
} else {
    menu.style.animation="menuClose 1s forwards";
  }
}

menu.onclick = expand();

