let menuOpen = false;

function expand() {
  if (menuOpen != true) { 
    document.getElementById.("menu").style.animation="menuOpen 1s";
    menuOpen = true;
} else {
      document.getElementById.("menu").style.animation="menuClose 1s";
  }
}

document.getElementById.("menu").onclick = expand();

