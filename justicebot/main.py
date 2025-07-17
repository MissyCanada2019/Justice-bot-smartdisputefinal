# main.py
# This script is used to start the Next.js application.
# It is intentionally simple to ensure a clean startup process.

import os
import subprocess
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Starts the Next.js development server."""
    logger.info("Starting the Next.js development server...")
    
    # Command to run the Next.js dev server
    # We use 'npm run dev' which is defined in package.json
    command = ["npm", "run", "dev"]
    
    try:
        # We use Popen to start the process and let it run.
        # This is a common way to manage a long-running server process from Python.
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        
        # Log the output from the Next.js server as it comes in
        for line in iter(process.stdout.readline, ''):
            logger.info(line.strip())
            
        # Wait for the process to complete (it won't, for a dev server, but this is good practice)
        process.wait()
        
    except FileNotFoundError:
        logger.error("Error: 'npm' command not found. Please ensure Node.js and npm are installed.")
    except Exception as e:
        logger.error(f"An error occurred while trying to start the server: {e}")

if __name__ == "__main__":
    main()
