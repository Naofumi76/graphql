document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Load profile page content
        loadProfilePage();
    });
});

function loadProfilePage() {
    document.body.innerHTML = `
        <div class="auth-container">
            <p>Hello</p>
        </div>
    `;
}
