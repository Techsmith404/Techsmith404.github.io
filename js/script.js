var menuOpen = false;

function expand() {
  var menu = document.getElementById("menu");
  var cover = document.getElementById('menuCover');

  if (menuOpen != true) { 
    menu.classList.remove("menuC");
    menu.classList.add("menuO");
    cover.classList.toggle('hidden');
    menuOpen = true;
} else {
    menu.classList.remove("menuO");
    menu.classList.add("menuC");
    cover.classList.toggle('hidden');
    menuOpen = false;
  }
}

