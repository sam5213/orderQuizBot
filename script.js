const questions = [
    {
        question: "Над какой задачей мы будем работать?",
        options: ["Создать квиз впервые", "Переделать существующий квиз", "Проконсультироваться", "Другое"]
    },
    {
        question: "Заготовлены ли у вас вопросы?",
        options: ["Да", "Подготовлю", "Пока не знаю", "Нет"]
    },
    {
        question: "Есть понимание как должен выглядеть ваш квиз?",
        options: ["Да", "Подготовлю примеры дизайнов", "Пока не знаю", "Нет"]
    },
    {
        question: "Готовы ли Вы экспериментировать с содержанием квиза?",
        options: ["Да, конечно", "Давай попробуем", "Думаю, что нет", "Нет, мне нужен срочно"]
    }
];

class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.userAnswers = [];
        this.init();
    }

    init() {
        // Welcome page
        document.getElementById('start-button').addEventListener('click', () => this.startQuiz());
	    document.getElementById('finish-button').addEventListener('click', () => this.sendResults());

        // Create SVG icons
        this.icons = [
            this.createIcon('circle', '#3b82f6'),
            this.createIcon('square', '#22c55e'),
            this.createIcon('triangle', '#eab308'),
            this.createIcon('x', '#ef4444')
        ];
    }

    createIcon(type, color) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', color);
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        let path = '';
        switch(type) {
            case 'circle':
                path = 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z';
                break;
            case 'square':
                path = 'M3 3h18v18H3z';
                break;
            case 'triangle':
                path = 'M3 20h18L12 4z';
                break;
            case 'x':
                svg.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>';
                return svg;
        }

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        svg.appendChild(pathElement);
        return svg;
    }

    startQuiz() {
        document.getElementById('welcome-page').classList.remove('active');
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('quiz-page').classList.add('active');
        this.showQuestion();
    }

    showQuestion() {
        const question = questions[this.currentQuestion];
        document.getElementById('question-text').textContent = question.question;

        const optionsGrid = document.getElementById('options-grid');
        optionsGrid.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';

            const iconClone = this.icons[index].cloneNode(true);
            iconClone.classList.add('option-icon');

            const textElement = document.createElement('span');
            textElement.textContent = option;

            optionElement.appendChild(iconClone);
            optionElement.appendChild(textElement);

            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsGrid.appendChild(optionElement);
        });
    }

    selectAnswer(index) {
        this.answers[this.currentQuestion] = index;

        const selected = questions[this.currentQuestion].options[index];
        const correct = questions[this.currentQuestion].options[0];
        this.userAnswers.push({ selected, correct });

        // Update UI to show selected answer
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[index].classList.add('selected');

        // Move to next question after a short delay
        if (this.currentQuestion < questions.length - 1) {
            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion();
            }, 500);
        } else {
	    this.finishQuiz()
	}
    }


    finishQuiz() {
        document.getElementById('quiz-page').classList.remove('active');
        document.getElementById('quiz-page').style.display = 'none';
        document.getElementById('finish-page').style.display = 'flex';	
    }

    sendResults() {
        const resultsToSend = this.userAnswers.map((answer, index) => {
            return `Вопрос ${index + 1}: Выбран "${answer.selected}", дефолтный ответ: "${answer.correct}"`;
        }).join('\n');
    
        // Форматируем данные в JSON
        const dataToSend = JSON.stringify({ resultsToSend });
    
        // Отправляем данные в бот
        Telegram.WebApp.sendData(dataToSend);

        document.getElementById('finish-page').style.display = 'none';
        document.getElementById('results-page').style.display = 'flex';	
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
