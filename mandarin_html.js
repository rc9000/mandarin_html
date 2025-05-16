document.addEventListener('DOMContentLoaded', function() {
    // Add translation popups to all words
    document.querySelectorAll('.word').forEach(word => {
        const translation = word.getAttribute('data-translation');
        const pinyin = word.getAttribute('data-pinyin');
        
        if (translation || pinyin) {
            const popup = document.createElement('div');
            popup.className = 'word-translation';
            
            let content = '';
            if (translation) {
                content += translation;
            }
            if (pinyin) {
                if (content) content += ' ';
                content += `[${pinyin}]`;
            }
            
            popup.textContent = content;
            word.appendChild(popup);
        }
    });

    // Add sentence translations
    document.querySelectorAll('.sentence').forEach(sentence => {
        const translation = sentence.getAttribute('data-translation');
        if (translation) {
            const translationDiv = document.createElement('div');
            translationDiv.className = 'sentence-translation';
            translationDiv.textContent = translation;
            sentence.appendChild(translationDiv);
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