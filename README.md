# mandarin_html

This is some HTML/CSS/JS/Python I have been playing with, to take notes and practice words while learning Mandarin. You can give it a try on https://rc9000.github.io/mandarin_html/example-1.html or get everything from the [github repo](https://github.com/rc9000/mandarin_html).

 * write down text in a file like [example-1.html](example-1.html) or [example-2.html](example-2.html)
   * wrap sentences into `<span class="sentence"></span>`
   * wrap sentences into `<span class="word"></span>`
   * include `mandarin_html.css` and `mandarin_html.js`
   * the rest of the document can be arbitrary valid HTML
 * allows providing a sentence-level and word-level translation in the `data-translation` attributes, since just a word-by-word translation is not necessarily enough to understand the sentence 
   * e.g. 你看看这个 = you look look this (measure word) = "check this out"
 * allows providing pinyin in `data-pinyin`
 * pinyin and translation are only shown when hovering over the text
 * [make_html_audio.py](make_html_audio.py) allows to generate audio clips for each sentence in a file via Azure Speech Studio
   * how to get an Azure account and Speech Services key is not explained here, see https://speech.microsoft.com/ for details
   * once you have a key for a region, create a venv with the requirements and launch the script as e.g. `SPEECH_KEY=1fd0... SPEECH_REGION=swedencentral ./mandarin_html_audio.py example-1.html` 
