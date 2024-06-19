var menuOpen = false;

function expand() {
  var menu = document.getElementById("menu");
  var cover = document.getElementById('menuCover');
  var nav = document.getElementById('navMenu');

  if (menuOpen != true) { 
    menu.classList.remove("menuC");
    menu.classList.add("menuO");
    cover.classList.toggle('hidden');
    nav.classList.toggle('hidden');
    menuOpen = true;
} else {
    menu.classList.remove("menuO");
    menu.classList.add("menuC");
    nav.classList.toggle('hidden');
    cover.classList.toggle('hidden');
    menuOpen = false;
  }
}

function enlarge(block) {
  var id = document.getElementById(block);
  
  // open a div with description of project

}
