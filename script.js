// DOM Elements
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const digitalDisplay = document.getElementById('digitalDisplay');
const lapTimes = document.getElementById('lapTimes');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.getElementById('statusText');
const body = document.body;

// Stopwatch variables
let isRunning = false;
let startTime = 0;
let elapsedTimeBeforePause = 0;
let animationFrameId = null;
let lapCount = 0;

// Create interactive particles
function createParticles() {
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 20 + 10;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.1 + 0.05;
    const color = `hsla(${Math.random() * 360}, 70%, 60%, ${opacity})`;

    // Apply properties
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.backgroundColor = color;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;

    document.body.appendChild(particle);
}

// Update clock hands and digital display
function updateStopwatch() {
    const elapsedMs = Date.now() - startTime + elapsedTimeBeforePause;

    // Analog hands
    const hourRotation = (elapsedMs / (1000 * 60 * 60)) * 30 % 360;
    const minuteRotation = (elapsedMs / (1000 * 60)) * 6 % 360;
    const secondRotation = (elapsedMs / 1000) * 6 % 360;

    hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;

    // Digital display
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((elapsedMs % 1000) / 10);

    digitalDisplay.textContent =
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}.` +
        `${milliseconds.toString().padStart(2, '0')}`;

    if (isRunning) {
        animationFrameId = requestAnimationFrame(updateStopwatch);
    }
}

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTimeBeforePause;
        updateStopwatch();

        // UI feedback
        statusIndicator.style.backgroundColor = '#2ecc71';
        statusText.textContent = 'Running';
        body.style.background = 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)';

        // Button states
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;

        // Add pulse animation to stopwatch face
        document.querySelector('.stopwatch-face').style.animation = 'pulse 2s infinite';
    }
}

// Stop the stopwatch
function stopStopwatch() {
    if (isRunning) {
        isRunning = false;
        elapsedTimeBeforePause = Date.now() - startTime;
        cancelAnimationFrame(animationFrameId);

        // UI feedback
        statusIndicator.style.backgroundColor = '#e74c3c';
        statusText.textContent = 'Paused';
        body.style.background = 'linear-gradient(135deg, #ffebee 0%, #ef9a9a 100%)';

        // Button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;

        // Remove pulse animation
        document.querySelector('.stopwatch-face').style.animation = '';
    }
}

// Reset the stopwatch
function resetStopwatch() {
    isRunning = false;
    elapsedTimeBeforePause = 0;
    startTime = 0;
    lapCount = 0;
    cancelAnimationFrame(animationFrameId);

    // Reset hands and display
    hourHand.style.transform = 'translateX(-50%) rotate(0deg)';
    minuteHand.style.transform = 'translateX(-50%) rotate(0deg)';
    secondHand.style.transform = 'translateX(-50%) rotate(0deg)';
    digitalDisplay.textContent = '00:00:00.00';
    lapTimes.innerHTML = '';

    // UI feedback
    statusIndicator.style.backgroundColor = '#95a5a6';
    statusText.textContent = 'Ready';
    body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

    // Button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    // Remove pulse animation
    document.querySelector('.stopwatch-face').style.animation = '';
}

// Record lap time
function recordLap() {
    if (isRunning || elapsedTimeBeforePause > 0) {
        lapCount++;
        const elapsedMs = isRunning ?
            Date.now() - startTime + elapsedTimeBeforePause :
            elapsedTimeBeforePause;

        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((elapsedMs % 1000) / 10);

        const lapTime =
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}.` +
            `${milliseconds.toString().padStart(2, '0')}`;

        const lapElement = document.createElement('div');
        lapElement.innerHTML = `<strong>Lap ${lapCount}:</strong> ${lapTime}`;
        lapTimes.prepend(lapElement);

        // Visual feedback
        lapElement.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        setTimeout(() => {
            lapElement.style.backgroundColor = '';
        }, 500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    document.getElementById('stopBtn').disabled = true;

    // Add floating animation to particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
        }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4); }
            70% { transform: scale(1.005); box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }
    `;
    document.head.appendChild(style);
});