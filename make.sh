#!/bin/bash

# Source the secret environment file
if [ -f "../secret-env.sh" ]; then
    echo "Sourcing ../secret-env.sh..."
    source ../secret-env.sh
else
    echo "Warning: ../secret-env.sh not found"
fi

# Activate virtual environment
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Error: venv directory not found"
    exit 1
fi

# Check if Python script exists
if [ ! -f "mandarin_html_audio.py" ]; then
    echo "Error: mandarin_html_audio.py not found"
    exit 1
fi

# Process all HTML files
echo "Processing HTML files..."
for html_file in *.html; do
    if [ -f "$html_file" ]; then
        echo "Processing $html_file..."
        python mandarin_html_audio.py "$html_file"
    fi
done

echo "Done processing all HTML files." 