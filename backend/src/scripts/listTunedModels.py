#!/usr/bin/env python3
"""
List all tuned models to find the correct model name
"""

import os
from google.cloud.aiplatform_v1 import GenAiTuningServiceClient
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT_ID', 'careercraftai-475216')
LOCATION = os.getenv('VERTEX_AI_LOCATION', 'us-central1')

def list_tuned_models():
    print('Listing Tuned Models\n')
    print('=' * 70)

    try:
        client = GenAiTuningServiceClient(
            client_options={"api_endpoint": f"{LOCATION}-aiplatform.googleapis.com"}
        )

        parent = f"projects/{PROJECT_ID}/locations/{LOCATION}"

        print(f'Parent: {parent}\n')
        print('Tuned Models:')
        print('-' * 70)

        # List tuning jobs to see all models
        request = client.list_tuning_jobs(parent=parent)

        for job in request:
            if job.state == 4:  # SUCCEEDED
                print(f'\nSUCCESS - Job: {job.name}')
                print(f'   Display Name: {job.tuned_model_display_name}')
                print(f'   Base Model: {job.base_model}')

                if hasattr(job, 'tuned_model') and job.tuned_model:
                    print(f'   Tuned Model: {job.tuned_model}')

                    # Extract the model name for use with VertexAI SDK
                    if hasattr(job.tuned_model, 'model'):
                        model_path = job.tuned_model.model
                        print(f'\n   >>> USE THIS MODEL PATH:')
                        print(f'   {model_path}')

                    if hasattr(job.tuned_model, 'endpoint'):
                        endpoint = job.tuned_model.endpoint
                        print(f'\n   Endpoint: {endpoint}')

        print('\n' + '=' * 70)

    except Exception as e:
        print(f'\nERROR: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    list_tuned_models()
