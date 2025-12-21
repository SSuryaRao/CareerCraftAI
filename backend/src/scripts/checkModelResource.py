#!/usr/bin/env python3
"""
Check the tuned model resource directly
"""

import os
from google.cloud import aiplatform_v1
from dotenv import load_dotenv

load_dotenv()

PROJECT_NUMBER = '1030709276859'
LOCATION = 'us-central1'
MODEL_ID = '5515333943366254592'

def check_model():
    print('Checking Model Resource\n')
    print('=' * 70)

    try:
        client = aiplatform_v1.ModelServiceClient(
            client_options={"api_endpoint": f"{LOCATION}-aiplatform.googleapis.com"}
        )

        model_name = f"projects/{PROJECT_NUMBER}/locations/{LOCATION}/models/{MODEL_ID}"

        print(f'Model Name: {model_name}\n')

        # Get model
        request = aiplatform_v1.GetModelRequest(name=model_name)
        model = client.get_model(request=request)

        print(f'Display Name: {model.display_name}')
        print(f'Description: {model.description}')
        print(f'Model Source Info: {model.model_source_info}')
        print(f'Deployed Model Count: {model.deployed_models}')
        print(f'Supported Deployment Resources: {model.supported_deployment_resources_types}')

        # Check if model can be used for online prediction
        print(f'\nSupported Prediction Instances: {model.supported_input_storage_formats}')
        print(f'Supported Output: {model.supported_output_storage_formats}')

        # Print full model info
        print(f'\nFull Model Info:')
        print(model)

        print('\n' + '=' * 70)

    except Exception as e:
        print(f'\nERROR: {e}')

        if '404' in str(e):
            print('\nModel not found.')
            print('The model may be registered differently or not accessible via Model Service.')
            print('\nFor Gemini tuned models, try accessing via the tuning job directly.')

if __name__ == '__main__':
    check_model()
