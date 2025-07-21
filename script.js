/* script.js - Final Version */
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const captchaImage = document.getElementById('captchaImage');
    const buttonsContainer = document.querySelector('.buttons');
    const h1 = document.querySelector('h1');

    // --- ROBUSTNESS CHECK ---
    // First, check if the Telegram Web App script is running.
    // This is crucial for debugging.
    if (!window.Telegram || !window.Telegram.WebApp) {
        h1.textContent = 'Unsupported Environment';
        buttonsContainer.innerHTML = '<p>This web page must be opened through the Telegram bot.</p>';
        // Stop all other code from running if not inside Telegram
        return;
    }

    // If the check passes, we can safely use the 'tg' object
    const tg = window.Telegram.WebApp;

    // Let the Telegram client know the app is ready and expand it
    tg.ready();
    tg.expand();

    // This function reads the quiz data from the URL parameter
    const getQuizDataFromUrl = () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const questionParam = urlParams.get('question');
            if (questionParam) {
                const decodedData = decodeURIComponent(questionParam);
                return JSON.parse(decodedData);
            }
        } catch (e) {
            console.error("Failed to parse question data from URL:", e);
        }
        return null;
    };

    // This function handles what happens when ANY button is clicked
    const handleButtonClick = (value) => {
        // Send the button's value (e.g., "F6G7H8" or "change") back to the bot
        tg.sendData(value);
        // Close the web app window and return to the chat
        tg.close();
    };

    // This function builds the quiz UI from the data it receives
    const displayQuiz = (questionData) => {
        // Safety check for valid data
        if (!questionData || !questionData.image_url || !questionData.options) {
            h1.textContent = 'Error';
            captchaImage.alt = 'Could not load quiz. Please go back and try again.';
            buttonsContainer.innerHTML = '';
            return;
        }

        // Set the image and clear any old buttons
        captchaImage.src = questionData.image_url;
        captchaImage.alt = 'CAPTCHA Quiz Image';
        buttonsContainer.innerHTML = '';

        // Create the answer buttons dynamically
        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            // Add a click listener that calls our handler function
            button.addEventListener('click', () => handleButtonClick(option));
            buttonsContainer.appendChild(button);
        });

        // Create the "Change Question" button
        const changeButton = document.createElement('button');
        changeButton.textContent = '🔁 Change Question';
        changeButton.dataset.value = 'change'; // Special value for the bot
        // Add a click listener that calls our handler function
        changeButton.addEventListener('click', () => handleButtonClick('change'));
        buttonsContainer.appendChild(changeButton);
    };

    // --- Main execution block ---
    const questionData = getQuizDataFromUrl();
    if (questionData) {
        // If we got data, build the quiz
        displayQuiz(questionData);
    } else {
        // If no data was in the URL, show an error
        h1.textContent = 'Quiz Not Found';
        captchaImage.style.display = 'none';
        buttonsContainer.innerHTML = '<p>No quiz data was provided. Please use the button in the bot to start the quiz.</p>';
    }
});
