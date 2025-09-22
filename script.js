const questions = [
    {
        question: "The text layer’s width adjusts to ensure all content fits within its boundaries",
        answers: ["Fixed Size", "Auto Height", "Auto Width", "Justification"],
        correct: 2
    },
    {
        question: "What should we press When the layer is already selected",
        answers: ["Insert", "Enter", "Shift", "Delete"],
        correct: 1
    },
    {
        question: "It plays a role in digital publishing as this is the medium through which information and ideas of a layout is coveyed",
        answers: ["Text Layer", "Text Form", "Texting", "Text"],
        correct: 3
    },
    {
        question: "In digital publishing it offers flexibility and easy editing without altering the entire design or layout",
        answers: ["Text Layers", "Text Bar", "Publishing", "Size"],
        correct: 0
    },
    {
        question: "Both the width and height of the text layer remain unchanged, regardless of its content.",
        answers: ["Resizing", "Center Justification", "Fixed Size", "Auto Height"],
        correct: 2
    },
    {
        question: "Determines how a text layer expands or contracts to fit its content",
        answers: ["Resizing Property", "Process of Editing", "Digital Publishing", "Text Layer"],
        correct: 0
    },
    {
        question: "How should we edit multiple layers at once?",
        answers: ["Click Enter only", "Click Return only", "Click layers manually", "Click multi-edit, or press Enter or Return"],
        correct: 3
    },
    {
        question: "The layer expands vertically to accommodate its content",
        answers: ["Auto Width", "Auto Height", "Fixed Height", "Fixed Height"],
        correct: 1
    },
    {
        question: "When the layer is not selected: double-click on the layer of the canvas. When the layer is already selected: Press the RETURN key to edit the text context",
        answers: ["Statement B is wrong, statement A is correct", "Statement A is wrong, statement B is correct", "Both statements are correct", "All of the above"],
        correct: 0
    },
    {
        question: "You may also create a text layer by doing the ____________ on the canvas, which allows you to enter longer strings of text and have wrap on a new line",
        answers: ["drag and drop", "click and drop", "drop and edit", "click and drag"],
        correct: 3
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 45;
let gameStarted = false;
let musicTimeouts = [];

function selectAnswer(answerIndex) {
    clearInterval(timer);
    
    // Play click sound
    playSound('click');
    
    // Add selected visual feedback
    const buttons = document.querySelectorAll('.answer-btn');
    buttons[answerIndex].classList.add('selected');
    
    setTimeout(() => {
        if (answerIndex === questions[currentQuestion].correct) {
            score += 2;
            document.getElementById('score').textContent = score;
            playSound('correct');
        } else {
            playSound('wrong');
        }
        
        nextQuestion();
    }, 500);
}

function nextQuestion() {
    // Add fade out transition
    document.querySelector('.quiz-container').classList.add('fade-out');
    
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
        
        // Fade back in
        document.querySelector('.quiz-container').classList.remove('fade-out');
    }, 300);
}

function startGame() {
    if (localStorage.getItem('quizCompleted')) {
        alert('You have already completed this quiz!');
        return;
    }
    
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    gameStarted = true;
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    startBackgroundMusic();
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = q.answers[index];
        btn.style.transform = 'scale(1)';
        btn.classList.remove('selected');
    });
    
    if (gameStarted) {
        startTimer();
    }
}

function startTimer() {
    timeLeft = 45;
    document.getElementById('time-left').textContent = timeLeft;
    document.querySelector('.timer').classList.remove('warning');
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        
        if (timeLeft <= 10) {
            document.querySelector('.timer').classList.add('warning');
            playSound('tick');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            playSound('wrong');
            nextQuestion();
        }
    }, 1000);
}

function playSound(type) {
    const audio = new Audio();
    
    if (type === 'click') {
        // Generate click sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'correct') {
        // Generate celebration sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
        // Generate error sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'tick') {
        // Generate intense tick sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
        osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'finish') {
        // Generate celebration finish sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.4);
        osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.0);
    }
}

function startBackgroundMusic() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    function createTone(freq, startTime, duration) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
    
    function playLoop() {
        const now = ctx.currentTime;
        // Viby, pressury beat pattern
        createTone(220, now, 0.2);
        createTone(330, now + 0.3, 0.2);
        createTone(440, now + 0.6, 0.2);
        createTone(330, now + 0.9, 0.2);
        createTone(220, now + 1.2, 0.2);
        createTone(440, now + 1.5, 0.2);
        
        const timeout = setTimeout(playLoop, 1800);
        musicTimeouts.push(timeout);
    }
    
    playLoop();
}

function stopBackgroundMusic() {
    musicTimeouts.forEach(timeout => clearTimeout(timeout));
    musicTimeouts = [];
}

function showResults() {
    localStorage.setItem('quizCompleted', 'true');
    stopBackgroundMusic();
    playSound('finish');
    
    document.querySelector('.quiz-container').innerHTML = `
        <h1>Quiz Complete!</h1>
        <h2>Final Score: ${score} / 20</h2>
        <p style="margin-top: 20px; opacity: 0.8;">Thank you for playing! You can only take this quiz once.</p>
    `;
}
