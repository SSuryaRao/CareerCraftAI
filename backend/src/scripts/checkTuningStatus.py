#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Vertex AI Fine-Tuning Job Status
"""

import os
import sys

# Set encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from google.cloud.aiplatform_v1 import GenAiTuningServiceClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT_ID', 'careercraftai-475216')
LOCATION = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
JOB_ID = '205153802997727232'  # Updated: 2025-12-13

def check_status():
    """Check the status of the fine-tuning job"""

    print('🔍 Checking Fine-Tuning Job Status\n')
    print('=' * 70)

    try:
        client = GenAiTuningServiceClient(client_options={"api_endpoint": f"{LOCATION}-aiplatform.googleapis.com"})

        job_name = f"projects/{PROJECT_ID}/locations/{LOCATION}/tuningJobs/{JOB_ID}"

        print(f'📋 Job Name: {job_name}\n')

        # Get the job
        job = client.get_tuning_job(name=job_name)

        # State mapping
        states = {
            0: "STATE_UNSPECIFIED",
            1: "JOB_STATE_QUEUED",
            2: "JOB_STATE_PENDING",
            3: "JOB_STATE_RUNNING",
            4: "JOB_STATE_SUCCEEDED",
            5: "JOB_STATE_FAILED",
            6: "JOB_STATE_CANCELLING",
            7: "JOB_STATE_CANCELLED",
            8: "JOB_STATE_PAUSED",
            9: "JOB_STATE_EXPIRED"
        }

        state_name = states.get(job.state, f"Unknown ({job.state})")

        print(f'📊 Status: {state_name}')
        print(f'📝 Display Name: {job.tuned_model_display_name}')
        print(f'🤖 Base Model: {job.base_model}')
        print(f'📅 Create Time: {job.create_time}')

        if job.state == 4:  # SUCCEEDED
            print(f'\n✅ Fine-tuning completed successfully!')
            print(f'🎯 Tuned Model: {job.tuned_model}')
            print(f'\n📌 Next step: Deploy the model using deployFineTunedModel.js')
        elif job.state == 3:  # RUNNING
            print(f'\n⏳ Job is currently running...')
            if job.update_time:
                print(f'🕐 Last Update: {job.update_time}')
        elif job.state == 5:  # FAILED
            print(f'\n❌ Job failed!')
            if job.error:
                print(f'Error: {job.error.message}')
        elif job.state in [1, 2]:  # QUEUED or PENDING
            print(f'\n⏳ Job is queued/pending...')

        print('\n' + '=' * 70)

    except Exception as e:
        print(f'\n❌ Error checking job status: {str(e)}')
        print(f'Error type: {type(e).__name__}')
        sys.exit(1)

if __name__ == '__main__':
    check_status()
