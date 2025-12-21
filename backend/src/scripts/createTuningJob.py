#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create Vertex AI Fine-Tuning Job using Google AI Python SDK
"""

import os
import sys

# Set encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from google.cloud import aiplatform
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT_ID', 'careercraftai-475216')
LOCATION = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
BASE_MODEL = 'gemini-2.5-flash'
DISPLAY_NAME = 'career-advisor-resume-analyzer-v1'

# GCS paths
TRAINING_DATA = 'gs://career-advisor-training-data/resume-analysis/training-data.jsonl'
VALIDATION_DATA = 'gs://career-advisor-training-data/resume-analysis/validation-data.jsonl'

def create_tuning_job():
    """Create a supervised fine-tuning job"""

    print('🚀 Creating Vertex AI Fine-Tuning Job\n')
    print('=' * 70)
    print(f'📋 Configuration:')
    print(f'   Project ID: {PROJECT_ID}')
    print(f'   Location: {LOCATION}')
    print(f'   Base Model: {BASE_MODEL}')
    print(f'   Display Name: {DISPLAY_NAME}')
    print(f'   Training Data: {TRAINING_DATA}')
    print(f'   Validation Data: {VALIDATION_DATA}\n')

    try:
        print('📤 Submitting fine-tuning job...\n')

        # Use the Gen AI Platform tuning API
        from google.cloud.aiplatform_v1 import GenAiTuningServiceClient
        from google.cloud.aiplatform_v1.types import SupervisedTuningSpec, TuningJob

        client = GenAiTuningServiceClient(client_options={"api_endpoint": f"{LOCATION}-aiplatform.googleapis.com"})

        parent = f"projects/{PROJECT_ID}/locations/{LOCATION}"

        # Create tuning job with dict structure
        tuning_job_config = {
            "base_model": f"publishers/google/models/{BASE_MODEL}",
            "tuned_model_display_name": DISPLAY_NAME,
            "supervised_tuning_spec": {
                "training_dataset_uri": TRAINING_DATA,
                "validation_dataset_uri": VALIDATION_DATA,
                "hyper_parameters": {
                    "epoch_count": 4,
                    "learning_rate_multiplier": 1.0,
                    "adapter_size": "ADAPTER_SIZE_FOUR"
                }
            }
        }

        response = client.create_tuning_job(
            parent=parent,
            tuning_job=tuning_job_config
        )

        print('✅ Fine-tuning job created successfully!\n')
        print(f'📊 Job Details:')
        print(f'   Name: {response.name}')
        print(f'   Model: {response.base_model}')
        print(f'   State: {response.state}\n')

        print('📈 Next Steps:\n')
        print('1. Monitor the job in Cloud Console:')
        print(f'   https://console.cloud.google.com/vertex-ai/locations/{LOCATION}/tuning-jobs?project={PROJECT_ID}\n')
        print('2. Once complete, the fine-tuned model will be available for deployment\n')
        print('⏱️  Estimated time: 30-120 minutes\n')
        print('=' * 70)

        return response.name

    except Exception as e:
        print(f'\n❌ Error creating tuning job: {str(e)}')
        print(f'\nError type: {type(e).__name__}')

        if 'permission' in str(e).lower():
            print('\n💡 Tip: Ensure your service account has:')
            print('   - Vertex AI User role')
            print('   - Storage Object Viewer role')

        sys.exit(1)

if __name__ == '__main__':
    create_tuning_job()
