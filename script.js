document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.buttons button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            if (window.Telegram && window.Telegram.WebApp) {
                // Send the clicked button's data-value back to the bot
                window.Telegram.WebApp.sendData(value);
                // Optionally close the web app after sending data.
                // For a multi-question quiz, you might not close immediately.
                // For this preview, we close to show the bot's response.
                window.Telegram.WebApp.close(); 
            } else {
                // Fallback for testing outside Telegram
                alert('Telegram Web App not found. Running outside Telegram.');
                console.log('Simulating data send:', value);
            }
        });
    });

    // Initialize Telegram Web App if available
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        // Optional: Customize Web App appearance
        // window.Telegram.WebApp.setHeaderColor('#2196F3'); // Blue header
        // window.Telegram.WebApp.setBackgroundColor('#E0F2F7'); // Light blue background
    }
});