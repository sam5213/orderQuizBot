const questions = [
    {
        question: "Какая тема вашего вашего Квиза?",
        options: ["Психология", "Финансы", "Экономика", "Другое"],
        answer: "Психология"
    },
    {
        question: "Сколько вопросов будет в вашем квизе (рекомендуется не больше 7-8)?",
        options: ["только 1", "поменьше, где-то 5-6", "давайте 7-8", "больше 8"],
        answer: "только 1"
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

function startQuiz() {
    currentQuestionIndex = 0;
    document.getElementById('app').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    askQuestion();
}

function askQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option, question.answer);
        optionsDiv.appendChild(button);
    });

    startTimer();
}

function checkAnswer(selected, correct) {
    const currentQuestion = questions[currentQuestionIndex];
    selectAnswer(selectedOption, currentQuestion.answer);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        askQuestion();
    } else {
        resetQuiz();
    }
}

function selectAnswer(selected, correct) {
    userAnswers.push({ selected, correct }); // Сохраняем ответ пользователя
}

function sendResults() {
    const resultsToSend = userAnswers.map((answer, index) => {
        return `Вопрос ${index + 1}: Выбран "${answer.selected}", дефолтный ответ: "${answer.correct}"`;
    }).join('\n');

    // Форматируем данные в JSON
    const dataToSend = JSON.stringify({ resultsToSend });

    // Отправляем данные в бот
    Telegram.WebApp.sendData(dataToSend);
}

document.getElementById('submit-results').onclick = sendResults; // Привязываем функцию 

function resetQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('submit-results').style.display = 'block';
    document.getElementById('app').style.display = 'block';
}
