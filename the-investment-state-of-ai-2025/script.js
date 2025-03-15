// JavaScript for the LessWrong-style navigation drawer

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const menuToggle = document.getElementById('menu-toggle');
  const closeNav = document.getElementById('close-nav');
  const overlay = document.getElementById('overlay');
  const navDrawer = document.getElementById('navigation-drawer');
  const body = document.body;
  
  // Toggle menu state (for accessibility)
  let menuOpen = false;
  
  // Open the navigation drawer
  function openDrawer() {
    navDrawer.classList.add('open');
    overlay.classList.add('open');
    body.style.overflow = 'hidden'; // Prevent scrolling when drawer is open
    menuOpen = true;
    
    // Set focus to the close button for better accessibility
    setTimeout(() => {
      closeNav.focus();
    }, 300);
  }
  
  // Close the navigation drawer
  function closeDrawer() {
    navDrawer.classList.remove('open');
    overlay.classList.remove('open');
    body.style.overflow = ''; // Restore scrolling
    menuOpen = false;
    
    // Return focus to menu toggle for accessibility
    setTimeout(() => {
      menuToggle.focus();
    }, 300);
  }
  
  // Event Listeners
  menuToggle.addEventListener('click', openDrawer);
  closeNav.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  
  // Handle keyboard navigation
  document.addEventListener('keydown', function(event) {
    // Close drawer on Escape key
    if (event.key === 'Escape' && menuOpen) {
      closeDrawer();
    }
    
    // Trap focus within the drawer when it's open (for accessibility)
    if (event.key === 'Tab' && menuOpen) {
      const focusableElements = navDrawer.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift+tab pressed and focus is on first element, move to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If tab pressed and focus is on last element, move to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  // Handle clicks on navigation links
  const navLinks = document.querySelectorAll('.NavigationDrawer-menuLink');
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Only activate for internal links
      if (this.getAttribute('href').startsWith('/') || this.getAttribute('href') === '#') {
        closeDrawer();
      }
    });
  });
  
  // Handle proper resizing behavior
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && menuOpen) {
      closeDrawer();
    }
  });
});