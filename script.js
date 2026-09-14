/* ==========================================
   ROMANTIC LOGIC & APPLICATION ENGINE
   Girlfriend Birthday Surprise Web Application
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STATE & DEFAULT CONFIGURATION
    // ==========================================
    const DEFAULT_STATE = {
        herName: "My Love",
        yourName: "Your Favorite Person ❤️",
        vaultCode: "LOVE",
        scratchNote: "My Love, every single day with you feels like a dream come true. You bring sunshine into my world, warmth to my heart, and endless joy to my life. I love you more than words could ever explain! Scratch Complete! 💖✨",
        loveLetter: `Dearest Birthday Girl,\n\nOn this special day, I want to remind you how deeply and endlessly loved you are. From the moment you entered my life, everything became brighter, sweeter, and infinitely more meaningful. Thank you for all the laughter, the gentle hugs, the late-night talks, and the unconditional warmth you give me.\n\nMay your new year be filled with boundless joy, success, adventure, and endless love. I am so blessed to walk through life by your side.\n\nHappy Birthday, my soulmate! Forever and always yours. ❤️`,
        progress: 0,
        taskCompleted: [false, false, false, false]
    };

    let state = loadState();

    function loadState() {
        try {
            const saved = localStorage.getItem('birthday_surprise_state');
            return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
        } catch (e) {
            return { ...DEFAULT_STATE };
        }
    }

    function saveState() {
        try {
            localStorage.setItem('birthday_surprise_state', JSON.stringify(state));
        } catch (e) {
            console.error('LocalStorage write error:', e);
        }
    }

    // ==========================================
    // 2. WEB AUDIO API SYNTHESIZER & SOUNDS
    // ==========================================
    let audioCtx = null;
    let isMusicPlaying = false;
    let musicInterval = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, duration = 0.2, type = 'sine', gainVal = 0.15) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    function playSoundEffect(type) {
        initAudioContext();
        if (type === 'correct') {
            playTone(523.25, 0.15, 'sine', 0.2); // C5
            setTimeout(() => playTone(659.25, 0.15, 'sine', 0.2), 100); // E5
            setTimeout(() => playTone(783.99, 0.25, 'sine', 0.25), 200); // G5
        } else if (type === 'wrong') {
            playTone(220, 0.2, 'sawtooth', 0.15);
            setTimeout(() => playTone(196, 0.25, 'sawtooth', 0.15), 150);
        } else if (type === 'sparkle') {
            [1046.5, 1318.5, 1567.9, 2093].forEach((f, idx) => {
                setTimeout(() => playTone(f, 0.12, 'triangle', 0.1), idx * 60);
            });
        } else if (type === 'pop') {
            playTone(800, 0.08, 'sine', 0.2);
        } else if (type === 'click') {
            playTone(400, 0.04, 'triangle', 0.1);
        } else if (type === 'victory') {
            const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
            notes.forEach((f, idx) => {
                setTimeout(() => playTone(f, 0.3, 'sine', 0.25), idx * 120);
            });
        } else if (type === 'blow') {
            playTone(150, 0.4, 'sine', 0.2);
        }
    }

    // Romantic Arpeggio Music Synth
    function toggleMusic() {
        initAudioContext();
        const musicBtn = document.getElementById('music-btn');
        const statusText = document.getElementById('music-status');

        if (isMusicPlaying) {
            clearInterval(musicInterval);
            isMusicPlaying = false;
            musicBtn.classList.remove('music-playing');
            statusText.textContent = 'Play Music';
        } else {
            isMusicPlaying = true;
            musicBtn.classList.add('music-playing');
            statusText.textContent = 'Playing 🎵';

            // Gentle romantic melody notes (C major / A minor chord progressions)
            const melodySequence = [
                523.25, 659.25, 783.99, 1046.5,
                587.33, 698.46, 880.00, 1046.5,
                440.00, 523.25, 659.25, 880.00,
                392.00, 493.88, 587.33, 783.99
            ];
            let noteIdx = 0;

            musicInterval = setInterval(() => {
                const freq = melodySequence[noteIdx % melodySequence.length];
                playTone(freq, 0.4, 'sine', 0.08);
                noteIdx++;
            }, 500);
        }
    }

    document.getElementById('music-btn').addEventListener('click', toggleMusic);

    // ==========================================
    // 3. BACKGROUND CANVAS (FLOATING HEARTS)
    // ==========================================
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let bgParticles = [];

    function resizeBgCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    class HeartParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * bgCanvas.width;
            this.y = bgCanvas.height + Math.random() * 100;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.hue = Math.random() * 40 + 330; // Pink / Rose hues
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -20) this.reset();
        }
        draw() {
            bgCtx.save();
            bgCtx.globalAlpha = this.opacity;
            bgCtx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
            bgCtx.beginPath();
            const topCurveHeight = this.size * 0.3;
            bgCtx.moveTo(this.x, this.y + topCurveHeight);
            bgCtx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
            bgCtx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
            bgCtx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight, this.x + this.size / 2, this.y + topCurveHeight);
            bgCtx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
            bgCtx.closePath();
            bgCtx.fill();
            bgCtx.restore();
        }
    }

    for (let i = 0; i < 30; i++) {
        bgParticles.push(new HeartParticle());
    }

    function animateBg() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgParticles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateBg);
    }
    animateBg();

    // ==========================================
    // 4. QUEST PROGRESS & INTERFACE SYNC
    // ==========================================
    function updateUI() {
        // Names
        document.getElementById('hero-name').textContent = state.herName;
        document.getElementById('finale-name').textContent = state.herName;
        document.getElementById('letter-sender-name').textContent = state.yourName;
        document.getElementById('scratch-note-text').textContent = state.scratchNote;

        // Progress bar
        const fill = document.getElementById('progress-fill');
        const percentText = document.getElementById('progress-percent');
        fill.style.width = `${state.progress}%`;
        percentText.textContent = `${state.progress}%`;

        // Step Badges
        const steps = [25, 50, 75, 100];
        steps.forEach((val, idx) => {
            const badge = document.getElementById(`step-badge-${idx + 1}`);
            if (state.progress >= val) {
                badge.classList.add('completed');
                badge.classList.remove('active');
            } else if (idx === 0 || state.progress >= steps[idx - 1]) {
                badge.classList.add('active');
            }
        });

        // Task Section Unlocks
        if (state.progress >= 25) unlockTaskSection('task-2-section');
        if (state.progress >= 50) unlockTaskSection('task-3-section');
        if (state.progress >= 75) unlockTaskSection('task-4-section');
        if (state.progress >= 100) {
            document.getElementById('finale-section').classList.remove('hidden-element');
        }
    }

    function unlockTaskSection(sectionId) {
        const sec = document.getElementById(sectionId);
        if (sec) {
            sec.classList.remove('locked-task');
        }
    }

    // ==========================================
    // 5. TASK 1: LOVE QUIZ
    // ==========================================
    const quizData = [
        {
            q: "Where is my absolute favorite place in the whole wide world?",
            options: [
                { text: "A luxury 5-star island resort 🌴", correct: false },
                { text: "Right next to you, anywhere! 💖", correct: true },
                { text: "At an arcade playing video games 🎮", correct: false }
            ],
            feedback: "Correct! Anywhere with you is my happy place! 🥰"
        },
        {
            q: "What was the exact moment I fell head over heels for you?",
            options: [
                { text: "The very first time you smiled at me ✨", correct: true },
                { text: "When you stole my french fries 🍟", correct: false },
                { text: "When you sent that hilarious meme 🤣", correct: false }
            ],
            feedback: "Bingo! That smile melted my heart forever! 💘"
        },
        {
            q: "How much do I love you?",
            options: [
                { text: "To the moon and back 🌙", correct: false },
                { text: "More than words can describe, infinite % ♾️💖", correct: true },
                { text: "A whole lot!", correct: false }
            ],
            feedback: "Spot on! Infinite love forever and ever! 👑"
        }
    ];

    let quizCorrectCount = 0;

    function renderQuiz() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';

        quizData.forEach((qObj, qIdx) => {
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.innerHTML = `
                <div class="quiz-q-title">${qIdx + 1}. ${qObj.q}</div>
                <div class="options-grid">
                    ${qObj.options.map((opt, oIdx) => `
                        <button class="option-btn" data-q="${qIdx}" data-o="${oIdx}">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-feedback" id="quiz-feedback-${qIdx}"></div>
            `;
            container.appendChild(card);
        });

        // Event listener for quiz options
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.option-btn');
            if (!btn || btn.disabled) return;

            const qIdx = parseInt(btn.dataset.q);
            const oIdx = parseInt(btn.dataset.o);
            const qObj = quizData[qIdx];
            const isCorrect = qObj.options[oIdx].correct;
            const feedbackEl = document.getElementById(`quiz-feedback-${qIdx}`);

            const siblings = btn.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(b => b.disabled = true);

            if (isCorrect) {
                btn.classList.add('correct-opt');
                feedbackEl.textContent = qObj.feedback;
                feedbackEl.style.color = '#2ecc71';
                playSoundEffect('correct');
                quizCorrectCount++;
            } else {
                btn.classList.add('wrong-opt');
                feedbackEl.textContent = "Oopsie! But I still love you! (Try selecting another ❤️)";
                feedbackEl.style.color = '#e74c3c';
                playSoundEffect('wrong');
                setTimeout(() => {
                    siblings.forEach(b => b.disabled = false);
                    btn.classList.remove('wrong-opt');
                }, 1000);
                return;
            }

            if (quizCorrectCount === quizData.length && state.progress < 25) {
                state.progress = 25;
                state.taskCompleted[0] = true;
                saveState();
                updateUI();
                playSoundEffect('victory');
                triggerConfettiBurst();

                setTimeout(() => {
                    document.getElementById('task-2-section').scrollIntoView({ behavior: 'smooth' });
                }, 800);
            }
        });
    }

    renderQuiz();

    // ==========================================
    // 6. TASK 2: SCRATCH CARD CANVAS
    // ==========================================
    const scratchCanvas = document.getElementById('scratch-canvas');
    const scratchCtx = scratchCanvas.getContext('2d');
    let isScratching = false;

    function initScratchCard() {
        scratchCtx.fillStyle = '#b5b5b5';
        scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Pattern text overlay on scratch card
        scratchCtx.fillStyle = '#888888';
        scratchCtx.font = 'bold 16px sans-serif';
        scratchCtx.textAlign = 'center';
        scratchCtx.fillText('✨ Scratch Me With Your Finger/Mouse 💌 ✨', scratchCanvas.width / 2, scratchCanvas.height / 2);
    }
    initScratchCard();

    function scratch(e) {
        if (!isScratching) return;
        const rect = scratchCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
        scratchCtx.fill();

        checkScratchPercentage();
    }

    function checkScratchPercentage() {
        const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        let clearPixels = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === 0) clearPixels++;
        }
        const percentage = (clearPixels / (imgData.data.length / 4)) * 100;

        if (percentage > 40 && !state.taskCompleted[1]) {
            scratchCanvas.style.pointerEvents = 'none';
            scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            document.getElementById('scratch-unlocked-tag').style.opacity = '1';
            document.getElementById('next-task-2-btn').classList.remove('hidden-btn');

            if (state.progress < 50) {
                state.progress = 50;
                state.taskCompleted[1] = true;
                saveState();
                updateUI();
                playSoundEffect('sparkle');
            }
        }
    }

    ['mousedown', 'touchstart'].forEach(evt => scratchCanvas.addEventListener(evt, () => isScratching = true));
    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => scratchCanvas.addEventListener(evt, () => isScratching = false));
    ['mousemove', 'touchmove'].forEach(evt => scratchCanvas.addEventListener(evt, scratch));

    document.getElementById('next-task-2-btn').addEventListener('click', () => {
        document.getElementById('task-3-section').scrollIntoView({ behavior: 'smooth' });
    });

    // ==========================================
    // 7. TASK 3: "CATCH MY LOVE" MINI GAME
    // ==========================================
    const gameCanvas = document.getElementById('game-canvas');
    const gameCtx = gameCanvas.getContext('2d');
    let gameHearts = [];
    let score = 0;
    let gameRunning = false;

    class GameHeart {
        constructor() {
            this.x = Math.random() * (gameCanvas.width - 40) + 20;
            this.y = gameCanvas.height + 20;
            this.size = Math.random() * 16 + 20;
            this.speed = Math.random() * 1.5 + 1.2;
            this.color = `hsl(${Math.random() * 30 + 330}, 90%, 65%)`;
        }
        update() {
            this.y -= this.speed;
        }
        draw() {
            gameCtx.save();
            gameCtx.fillStyle = this.color;
            gameCtx.beginPath();
            const topCurveHeight = this.size * 0.3;
            gameCtx.moveTo(this.x, this.y + topCurveHeight);
            gameCtx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
            gameCtx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
            gameCtx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight, this.x + this.size / 2, this.y + topCurveHeight);
            gameCtx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
            gameCtx.closePath();
            gameCtx.fill();
            gameCtx.restore();
        }
    }

    function startGame() {
        score = 0;
        gameHearts = [];
        gameRunning = true;
        document.getElementById('game-score').textContent = `0 / 10`;
        document.getElementById('game-overlay').style.display = 'none';

        function spawn() {
            if (!gameRunning) return;
            if (gameHearts.length < 5) {
                gameHearts.push(new GameHeart());
            }
            setTimeout(spawn, Math.random() * 600 + 400);
        }
        spawn();
        animateGame();
    }

    function animateGame() {
        if (!gameRunning) return;
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameHearts.forEach((h, index) => {
            h.update();
            h.draw();
            if (h.y < -30) {
                gameHearts.splice(index, 1);
            }
        });
        requestAnimationFrame(animateGame);
    }

    gameCanvas.addEventListener('click', (e) => {
        if (!gameRunning) return;
        const rect = gameCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        gameHearts.forEach((h, index) => {
            const dist = Math.hypot(clickX - h.x, clickY - h.y);
            if (dist < h.size * 1.2) {
                gameHearts.splice(index, 1);
                score++;
                playSoundEffect('pop');
                document.getElementById('game-score').textContent = `${score} / 10`;

                if (score >= 10) {
                    gameRunning = false;
                    playSoundEffect('victory');
                    triggerConfettiBurst();
                    document.getElementById('reasons-container').classList.remove('hidden-element');

                    if (state.progress < 75) {
                        state.progress = 75;
                        state.taskCompleted[2] = true;
                        saveState();
                        updateUI();
                    }
                }
            }
        });
    });

    document.getElementById('start-game-btn').addEventListener('click', startGame);

    // Render 10 Reasons Flip Cards
    const reasonsData = [
        "1. Your laugh is my favorite sound in the whole universe.",
        "2. The adorable way your eyes sparkle when you are excited.",
        "3. How you turn even simple quiet moments into magic.",
        "4. Your kind, warm, and endlessly compassionate heart.",
        "5. The cozy, safe feeling I get whenever I hold your hand.",
        "6. How you always know exactly how to make me smile.",
        "7. Your cute little habits that make you uniquely YOU.",
        "8. Because you are my absolute best friend and soulmate.",
        "9. The way you inspire me to be a better person every day.",
        "10. Simply because you are YOU, and I adore everything about you! 💖"
    ];

    function renderReasons() {
        const grid = document.getElementById('reasons-grid');
        grid.innerHTML = '';
        reasonsData.forEach((reason, idx) => {
            const card = document.createElement('div');
            card.className = 'flip-card';
            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">Reason #${idx + 1} 💌</div>
                    <div class="flip-card-back">${reason}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    renderReasons();

    document.getElementById('next-task-3-btn').addEventListener('click', () => {
        document.getElementById('task-4-section').scrollIntoView({ behavior: 'smooth' });
    });

    // ==========================================
    // 8. TASK 4: SECRET VAULT LOCK
    // ==========================================
    let enteredCode = [];

    document.getElementById('keypad').addEventListener('click', (e) => {
        const btn = e.target.closest('.key-btn');
        if (!btn) return;
        playSoundEffect('click');

        if (btn.id === 'key-clear') {
            enteredCode = [];
            updateLockDisplay();
            return;
        }

        const key = btn.dataset.key;
        if (enteredCode.length < 4) {
            enteredCode.push(key);
            updateLockDisplay();
        }

        if (enteredCode.length === 4) {
            checkVaultCode();
        }
    });

    function updateLockDisplay() {
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById(`digit-${i}`);
            el.textContent = enteredCode[i - 1] || '_';
        }
    }

    function checkVaultCode() {
        const inputStr = enteredCode.join('').toUpperCase();
        const targetStr = state.vaultCode.trim().toUpperCase();
        const feedback = document.getElementById('lock-feedback');

        if (inputStr === targetStr || inputStr === 'LOVE' || inputStr === '1214') {
            feedback.textContent = "🔓 Vault Unlocked Successfully! 🎉";
            feedback.style.color = '#2ecc71';
            playSoundEffect('victory');
            triggerConfettiBurst();

            state.progress = 100;
            state.taskCompleted[3] = true;
            saveState();
            updateUI();

            setTimeout(() => {
                const finaleSec = document.getElementById('finale-section');
                finaleSec.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        } else {
            feedback.textContent = "❌ Incorrect Code! Try 'LOVE' or '1214'";
            feedback.style.color = '#e74c3c';
            playSoundEffect('wrong');
            setTimeout(() => {
                enteredCode = [];
                updateLockDisplay();
                feedback.textContent = "";
            }, 1200);
        }
    }

    // ==========================================
    // 9. GRAND FINALE: CAKE & CANDLES
    // ==========================================
    const candlesCanvas = document.getElementById('candles-canvas');
    const candlesCtx = candlesCanvas.getContext('2d');
    let candlesLit = true;
    let flameParticles = [];

    function initCandlesCanvas() {
        candlesCanvas.width = 280;
        candlesCanvas.height = 280;
    }
    initCandlesCanvas();

    class FlameParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 4;
            this.speedY = Math.random() * 0.4 + 0.2;
            this.opacity = 1;
        }
        update() {
            this.y -= this.speedY;
            this.opacity -= 0.03;
        }
        draw() {
            candlesCtx.save();
            candlesCtx.globalAlpha = Math.max(0, this.opacity);
            candlesCtx.fillStyle = '#ff9f43';
            candlesCtx.beginPath();
            candlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            candlesCtx.fill();
            candlesCtx.restore();
        }
    }

    const candlePositions = [
        { x: 120, y: 40 }, { x: 140, y: 32 }, { x: 160, y: 40 }
    ];

    function drawFlames() {
        candlesCtx.clearRect(0, 0, candlesCanvas.width, candlesCanvas.height);
        if (candlesLit) {
            candlePositions.forEach(pos => {
                // Glow
                const grad = candlesCtx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, 15);
                grad.addColorStop(0, '#ffeaa7');
                grad.addColorStop(0.5, '#ff7675');
                grad.addColorStop(1, 'transparent');
                candlesCtx.fillStyle = grad;
                candlesCtx.beginPath();
                candlesCtx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
                candlesCtx.fill();

                if (Math.random() < 0.3) {
                    flameParticles.push(new FlameParticle(pos.x + (Math.random() * 4 - 2), pos.y));
                }
            });

            flameParticles.forEach((p, idx) => {
                p.update();
                p.draw();
                if (p.opacity <= 0) flameParticles.splice(idx, 1);
            });
        }
        requestAnimationFrame(drawFlames);
    }
    drawFlames();

    document.getElementById('blow-candles-btn').addEventListener('click', () => {
        if (!candlesLit) return;
        candlesLit = false;
        playSoundEffect('blow');
        triggerConfettiBurst();
        document.getElementById('wish-message').classList.remove('hidden-element');
    });

    document.getElementById('re-light-btn').addEventListener('click', () => {
        candlesLit = true;
        document.getElementById('wish-message').classList.add('hidden-element');
        playSoundEffect('sparkle');
    });

    // Lightbox for Polaroids
    document.querySelectorAll('.polaroid-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const caption = card.querySelector('.polaroid-caption');
            document.getElementById('lightbox-img').src = img.src;
            document.getElementById('lightbox-caption').textContent = caption.textContent;
            document.getElementById('lightbox-modal').classList.remove('hidden-element');
        });
    });

    document.getElementById('close-lightbox-btn').addEventListener('click', () => {
        document.getElementById('lightbox-modal').classList.add('hidden-element');
    });

    // ==========================================
    // 10. TYPEWRITER LOVE LETTER MODAL
    // ==========================================
    const letterModal = document.getElementById('letter-modal');
    const typewriterEl = document.getElementById('typewriter-content');
    let typewriterTimeout = null;

    document.getElementById('open-letter-btn').addEventListener('click', () => {
        letterModal.classList.remove('hidden-element');
        typewriterEl.textContent = '';
        const fullText = state.loveLetter;
        let charIdx = 0;

        function typeChar() {
            if (charIdx < fullText.length) {
                typewriterEl.textContent += fullText.charAt(charIdx);
                charIdx++;
                typewriterTimeout = setTimeout(typeChar, 35);
            }
        }
        typeChar();
    });

    document.getElementById('close-letter-btn').addEventListener('click', () => {
        clearTimeout(typewriterTimeout);
        letterModal.classList.add('hidden-element');
    });

    // ==========================================
    // 11. CONFETTI ANIMATION ENGINE
    // ==========================================
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    function triggerConfettiBurst() {
        for (let i = 0; i < 80; i++) {
            confettiPieces.push({
                x: confettiCanvas.width / 2,
                y: confettiCanvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.7) * 14,
                size: Math.random() * 8 + 6,
                color: `hsl(${Math.random() * 360}, 90%, 65%)`,
                rotation: Math.random() * 360,
                rSpeed: Math.random() * 10 - 5,
                opacity: 1
            });
        }
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravity
            p.rotation += p.rSpeed;
            p.opacity -= 0.008;

            confettiCtx.save();
            confettiCtx.globalAlpha = Math.max(0, p.opacity);
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            confettiCtx.restore();

            if (p.opacity <= 0) confettiPieces.splice(idx, 1);
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    // ==========================================
    // 12. CUSTOMIZER DRAWER MANAGER
    // ==========================================
    const customizerDrawer = document.getElementById('customizer-drawer');

    document.getElementById('customizer-btn').addEventListener('click', () => {
        document.getElementById('input-her-name').value = state.herName;
        document.getElementById('input-your-name').value = state.yourName;
        document.getElementById('input-vault-code').value = state.vaultCode;
        document.getElementById('input-scratch-note').value = state.scratchNote;
        document.getElementById('input-love-letter').value = state.loveLetter;
        customizerDrawer.classList.remove('hidden-element');
    });

    document.getElementById('close-customizer-btn').addEventListener('click', () => {
        customizerDrawer.classList.add('hidden-element');
    });

    document.getElementById('customizer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.herName = document.getElementById('input-her-name').value.trim();
        state.yourName = document.getElementById('input-your-name').value.trim();
        state.vaultCode = document.getElementById('input-vault-code').value.trim();
        state.scratchNote = document.getElementById('input-scratch-note').value.trim();
        state.loveLetter = document.getElementById('input-love-letter').value.trim();

        saveState();
        updateUI();
        customizerDrawer.classList.add('hidden-element');
        playSoundEffect('sparkle');
    });

    document.getElementById('reset-customizer-btn').addEventListener('click', () => {
        if (confirm("Reset all customized text to original defaults?")) {
            state = { ...DEFAULT_STATE };
            saveState();
            updateUI();
            customizerDrawer.classList.add('hidden-element');
        }
    });

    // Initial UI render
    updateUI();
});
