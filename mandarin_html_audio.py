#!/usr/bin/env python3

import azure.cognitiveservices.speech as speechsdk
import os, sys, re
from bs4 import BeautifulSoup
import argparse

def synthesize_ssml_to_wav(ssml_content, key, region, output_file):
    speech_config = speechsdk.SpeechConfig(subscription=key, region=region)
    audio_config = speechsdk.audio.AudioConfig(filename=output_file)
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    result = speech_synthesizer.speak_ssml_async(ssml_content).get()
    
    # Check the result
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print(f"Speech synthesized to {output_file}")
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print(f"Speech synthesis canceled: {cancellation_details.reason}")
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print(f"Error details: {cancellation_details.error_details}")

def process_html_file(html_file):
    # Create audio directory if it doesn't exist
    audio_dir = os.path.join(os.path.dirname(html_file), 'audio')
    os.makedirs(audio_dir, exist_ok=True)
    
    # Read and parse HTML file
    with open(html_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file.read(), 'html.parser')
    
    # Find all sentences
    sentences = soup.find_all('span', class_='sentence')
    
    # Get Azure credentials
    key = os.environ.get('SPEECH_KEY')
    region = os.environ.get('SPEECH_REGION')
    
    if not key or not region:
        print("Error: SPEECH_KEY and SPEECH_REGION environment variables must be set")
        sys.exit(1)
    
    # Process each sentence
    for i, sentence in enumerate(sentences):
        # Get the Chinese text (excluding the period)
        chinese_text = ''.join(word.text for word in sentence.find_all('span', class_='word') if word.text != '。')
        
        # Create SSML content
        ssml_content = f"""<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" 
            xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN">
            <voice name="zh-CN-YunxiNeural"><s /><mstts:express-as role="YoungAdultMale" style="narration-relaxed">
            <prosody rate="-2.00%" volume="+20.00%">{chinese_text}</prosody></mstts:express-as><s />
            </voice>
        </speak>
        """
        
        # Generate output filename
        output_file = os.path.join(audio_dir, f"{os.path.basename(html_file)}.{i+1}.wav")
        
        # Synthesize if file doesn't exist
        if not os.path.exists(output_file):
            synthesize_ssml_to_wav(ssml_content, key, region, output_file)
        else:
            print(f"{output_file} exists, skipped")

def main():
    parser = argparse.ArgumentParser(description='Generate audio files from Mandarin HTML content')
    parser.add_argument('html_file', help='Path to the HTML file containing Mandarin text')
    args = parser.parse_args()
    
    process_html_file(args.html_file)

if __name__ == "__main__":
    main()
