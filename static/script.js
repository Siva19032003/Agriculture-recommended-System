// Toggle Side Navigation Bar
const sidenav = document.getElementById('sidenav');
const mainContent = document.getElementById('mainContent');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  sidenav.classList.toggle('expanded');
  mainContent.classList.toggle('expanded');
});

