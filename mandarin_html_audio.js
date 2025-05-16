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
}); 