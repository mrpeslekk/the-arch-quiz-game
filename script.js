/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const captchaImage = document.getElementById('captchaImage');
    const buttonsContainer = document.querySelector('.buttons');
    const h1 = document.querySelector('h1');
    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();

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

    const displayQuiz = (questionData) => {
        if (!questionData || !questionData.image_url || !questionData.options) {
            h1.textContent = 'Error';
            captchaImage.alt = 'Could not load quiz. Please go back and try again.';
            buttonsContainer.innerHTML = '';
            return;
        }

        captchaImage.src = questionData.image_url;
        captchaImage.alt = 'CAPTCHA Quiz Image';
        buttonsContainer.innerHTML = '';

        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.dataset.value = option;
            button.addEventListener('click', () => {
                tg.sendData(button.dataset.value);
                tg.close();
            });
            buttonsContainer.appendChild(button);
        });

        const changeButton = document.createElement('button');
        changeButton.textContent = '🔁 Change Question';
        changeButton.dataset.value = 'change';
        changeButton.addEventListener('click', () => {
            tg.sendData('change');
            tg.close();
        });
        buttonsContainer.appendChild(changeButton);
    };

    const questionData = getQuizDataFromUrl();
    if (questionData) {
        displayQuiz(questionData);
    } else {
        h1.textContent = 'Quiz Not Found';
        captchaImage.style.display = 'none';
        buttonsContainer.innerHTML = '<p>No quiz data was provided. Please use the button in the bot to start the quiz.</p>';
    }
});
