// JavaScript for LessWrong Navigation Drawer functionality

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const closeNav = document.getElementById('close-nav');
  const overlay = document.getElementById('overlay');
  const navDrawer = document.getElementById('navigation-drawer');
  
  // Open the navigation drawer when menu button is clicked
  menuToggle.addEventListener('click', function() {
    navDrawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when drawer is open
  });
  
  // Close the navigation drawer when close button is clicked
  closeNav.addEventListener('click', closeDrawer);
  
  // Close the navigation drawer when clicking on the overlay
  overlay.addEventListener('click', closeDrawer);
  
  // Function to close the drawer
  function closeDrawer() {
    navDrawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Close the drawer when pressing the Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
});