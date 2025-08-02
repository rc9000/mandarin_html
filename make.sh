#!/bin/bash -eu

# Source the secret environment file - sample in this directory
source ../secret-env.sh

source venv/bin/activate

echo "Processing HTML files..."
for html_file in *.html; do
    echo "Processing $html_file..."
    python mandarin_html_audio.py "$html_file"
done

echo "Done processing all HTML files." 