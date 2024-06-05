var menuOpen = false;

function expand() {
  var menu = document.getElementById("menu");
  var cover = document.getElementById('menuCover');
  var nav = document.getElementById('navMenu');

  if (menuOpen != true) { 
    menu.classList.remove("menuC");
    menu.classList.add("menuO");
    cover.classList.toggle('hidden');
    setTimeout(() => { nav.classList.toggle('hidden');}, 500);
    menuOpen = true;
} else {
    menu.classList.remove("menuO");
    menu.classList.add("menuC");
    nav.classList.toggle('hidden');
    cover.classList.toggle('hidden');
    menuOpen = false;
  }
}

