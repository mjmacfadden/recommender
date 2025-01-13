document.querySelectorAll('.nav-skinny a').forEach(icon => {
    icon.addEventListener('click', function() {
        const target = document.querySelector(this.dataset.target);

        // Toggle navigation panels
        document.querySelectorAll('.expanded-nav').forEach(nav => {
            if (nav !== target) nav.classList.remove('open');
        });
        target.classList.toggle('open');

        // Highlight selected icon
        document.querySelectorAll('.nav-skinny a').forEach(navIcon => {
            navIcon.classList.remove('active');
        });
        this.classList.add('active');
    });
});

//Initialize WYSIIWYG
const quill = new Quill('#editor', {
    theme: 'snow'
  });

// Select the icon element
const icon = document.getElementById('chatIcon');

// Add a click event to stop the animation
icon.addEventListener('click', () => {
    icon.classList.remove('flash'); // Remove the flashing animation
    icon.classList.add('clicked'); // Ensure the background returns to its original
});