document.addEventListener('DOMContentLoaded', function () {
    // Example: Live theme preview
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function () {
            const selectedTheme = themeSelect.value;
            document.body.className = selectedTheme + '-theme';
        });
    }
});