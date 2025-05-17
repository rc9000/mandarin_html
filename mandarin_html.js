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

    // Create font switcher element
    const fontSwitcher = document.createElement('div');
    fontSwitcher.className = 'font-switcher';
    
    const select = document.createElement('select');
    select.innerHTML = `
        <option value="font-ma-shan-zheng" selected>Ma Shan Zheng</option>
        <option value="font-klee-one">Klee One</option>
        <option value="font-zen-old-mincho">Zen Old Mincho</option>
        <option value="font-ibm-plex-sans-jp">IBM Plex Sans JP</option>
    `;
    
    fontSwitcher.appendChild(select);
    document.body.appendChild(fontSwitcher);
    
    // Set initial font class
    document.body.classList.add('font-ma-shan-zheng');
    
    // Handle font switching
    select.addEventListener('change', function() {
        // Remove all font classes
        document.body.classList.remove('font-ma-shan-zheng', 'font-klee-one', 'font-zen-old-mincho', 'font-ibm-plex-sans-jp');
        // Add selected font class
        document.body.classList.add(this.value);
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