document.addEventListener('DOMContentLoaded', function() {
    // Add play buttons and audio elements to all sentences
    document.querySelectorAll('.sentence').forEach(sentence => {
        const translation = sentence.getAttribute('data-translation');
        if (!translation) return;

        // Create play button
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = '▶';
        playButton.title = 'Play audio';
        
        // Create audio element
        const audio = document.createElement('audio');
        const safeTranslation = translation.replace(/[^a-zA-Z0-9]/g, '_');
        const audioPath = `audio/${window.location.pathname.split('/').pop()}.${safeTranslation}.wav`;
        audio.src = audioPath;
        
        // Add click handler
        playButton.addEventListener('click', function() {
            // Stop any currently playing audio
            document.querySelectorAll('audio').forEach(a => {
                if (a !== audio) {
                    a.pause();
                    a.currentTime = 0;
                }
            });
            
            // Toggle play/pause
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '⏸';
            } else {
                audio.pause();
                audio.currentTime = 0;
                playButton.innerHTML = '▶';
            }
        });
        
        // Add ended event listener
        audio.addEventListener('ended', function() {
            playButton.innerHTML = '▶';
        });
        
        // Add error handling
        audio.addEventListener('error', function() {
            console.error(`Error loading audio file: ${audioPath}`);
            playButton.style.display = 'none';
        });
        
        // Insert elements
        sentence.insertBefore(playButton, sentence.firstChild);
        sentence.appendChild(audio);
    });

    // Add word translations
    document.querySelectorAll('.word').forEach(word => {
        const translation = word.getAttribute('data-translation');
        const pinyin = word.getAttribute('data-pinyin');
        if (translation) {
            const translationSpan = document.createElement('span');
            translationSpan.className = 'word-translation';
            translationSpan.textContent = pinyin ? `${translation} (${pinyin})` : translation;
            word.appendChild(translationSpan);
        }
    });

    // Add sentence translations
    document.querySelectorAll('.sentence').forEach(sentence => {
        const translation = sentence.getAttribute('data-translation');
        if (translation) {
            const translationSpan = document.createElement('span');
            translationSpan.className = 'sentence-translation';
            translationSpan.textContent = translation;
            sentence.appendChild(translationSpan);
        }
    });
});

// Global audio element
let currentAudio = null;
let currentButton = null;

function playAudio(button) {
    const sentence = button.closest('.sentence');
    const audioPath = sentence.getAttribute('data-audio');
    
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        if (currentButton) {
            currentButton.classList.remove('playing');
            currentButton.textContent = '▶';
        }
    }
    
    // If clicking the same button, just stop
    if (currentButton === button) {
        currentButton = null;
        return;
    }
    
    // Play new audio
    currentAudio = new Audio(audioPath);
    currentButton = button;
    
    currentAudio.addEventListener('play', () => {
        button.classList.add('playing');
        button.textContent = '⏸';
    });
    
    currentAudio.addEventListener('pause', () => {
        button.classList.remove('playing');
        button.textContent = '▶';
    });
    
    currentAudio.addEventListener('ended', () => {
        button.classList.remove('playing');
        button.textContent = '▶';
        currentAudio = null;
        currentButton = null;
    });
    
    currentAudio.play();
} 