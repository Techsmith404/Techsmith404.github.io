var menuOpen = false;

function expand() {
  var menu = document.getElementById("menu");
  var banner = document.getElementsByClassName('menuBanner');

  if (menuOpen != true) { 
    menu.classList.remove("menuC");
    menu.classList.add("menuO");
    menuOpen = true;
} else {
    menu.classList.remove("menuO");
    menu.classList.add("menuC");
    menuOpen = false;
  }
}

