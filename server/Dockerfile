# Use the official Python image
FROM python:3

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /music_server/project

# Copy all files into the container
COPY . /music_server/

# Install dependencies
RUN pip install --no-cache-dir -r /music_server/requirements.txt

# Expose the port
EXPOSE 8000

# Run the application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]