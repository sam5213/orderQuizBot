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
    document.getElementById('finish').style.display = 'none';
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
        button.onclick = () => selectAnswer(option, question.answer);
        optionsDiv.appendChild(button);
    });
}

function selectAnswer(selected, correct) {
    userAnswers.push({ selected, correct }); // Сохраняем ответ пользователя
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        askQuestion();
    } else {
        resetQuiz();
    }
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

function resetQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('finish').style.display = 'block';
}
