#!/bin/bash
cd /home/kavia/workspace/code-generation/daily-notes-organizer-13520/task_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

