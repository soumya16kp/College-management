#!/usr/bin/env bash
set -o errexit

echo "Installing Python dependencies..."
pip install -r potfinder/requirements.txt

echo "Collecting static files..."
python potfinder/manage.py collectstatic --noinput

echo "Applying migrations..."
python potfinder/manage.py migrate
