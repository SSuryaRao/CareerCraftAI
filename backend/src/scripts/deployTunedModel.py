#!/usr/bin/env python3
"""
Check deployment status and information for tuned model
"""

import os
from google.cloud import aiplatform
from dotenv import load_dotenv

load_dotenv()

PROJECT_NUMBER = os.getenv('GOOGLE_CLOUD_PROJECT_NUMBER', '1030709276859')
PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT_ID', 'careercraftai-475216')
LOCATION = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
ENDPOINT_ID = '6655325191230455808'

def check_endpoint():
    print('Checking Endpoint Deployment Status\n')
    print('=' * 70)

    try:
        # Initialize Vertex AI
        aiplatform.init(project=PROJECT_ID, location=LOCATION)

        # Get the endpoint
        endpoint_name = f"projects/{PROJECT_NUMBER}/locations/{LOCATION}/endpoints/{ENDPOINT_ID}"

        print(f'Endpoint: {endpoint_name}\n')

        endpoint = aiplatform.Endpoint(endpoint_name)

        print(f'Display Name: {endpoint.display_name}')
        print(f'Resource Name: {endpoint.resource_name}')
        print(f'Create Time: {endpoint.create_time}')
        print(f'Update Time: {endpoint.update_time}')

        # Check deployed models
        print('\nDeployed Models:')
        print('-' * 70)

        if hasattr(endpoint, 'deployed_models'):
            for deployed_model in endpoint.deployed_models:
                print(f'\nModel ID: {deployed_model.id}')
                print(f'Model: {deployed_model.model}')
                print(f'Display Name: {deployed_model.display_name}')

                if hasattr(deployed_model, 'dedicated_resources'):
                    print(f'Machine Type: {deployed_model.dedicated_resources.machine_spec.machine_type}')
                    print(f'Min Replicas: {deployed_model.dedicated_resources.min_replica_count}')
                    print(f'Max Replicas: {deployed_model.dedicated_resources.max_replica_count}')

                if hasattr(deployed_model, 'model_version_id'):
                    print(f'Version: {deployed_model.model_version_id}')

        else:
            print('No deployed models found on this endpoint')
            print('\nThe tuned model may need to be manually deployed.')
            print('Fine-tuned Gemini models should auto-deploy, but there may be an issue.')

        print('\n' + '=' * 70)

    except Exception as e:
        print(f'\nERROR: {e}')
        import traceback
        traceback.print_exc()

        print('\nPossible issues:')
        print('1. Endpoint may not exist yet')
        print('2. Model may still be deploying')
        print('3. IAM permissions may be missing')

if __name__ == '__main__':
    check_endpoint()
