let menuOpen = false;

function expand() {
  if (menuOpen != true) { 
    document.getElementById.("menu").style.animation="menuOpen 1s forwards";
    menuOpen = true;
} else {
      document.getElementById.("menu").style.animation="menuClose 1s forwards";
  }
}

document.getElementById.("menu").onclick = expand();

