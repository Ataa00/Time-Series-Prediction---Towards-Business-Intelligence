import sys
import pandas as pd
import matplotlib.pyplot as plt
from prophet import Prophet
import numpy as np
from PIL import Image
import io
import boto3
import requests
import os

from .data_classes import Settings

settings = Settings()


from aixplain.factories import PipelineFactory

NUMERIC_DTYPES = [np.int64, np.float64]

# # AWS credentials
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
BUCKET_NAME = os.environ.get('BUCKET_NAME')


def save_to_image_file(image_buffer, image_path):
    # For example, you can use PIL to open the image from the buffer
    image = Image.open(image_buffer)
    # Save the image to the specified path
    image.save(image_path)
    # Do not close the buffer here
    return image


def upload_to_s3(image_path, s3_key):
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    try:
        s3.upload_file(image_path, BUCKET_NAME, 'images/' + s3_key)
        print("Uploaded image to S3:", s3_key)
        # Construct the URL for the uploaded image
        s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/images/{s3_key}"
        print("Image URL:", s3_url)
        return s3_url
    except Exception as e:
        print("Error uploading image to S3:", e)
        return sys.exit()

def forecast(csv_file, date_col, target_col, cycle_type, period):
    df = pd.read_csv(csv_file)

    df[date_col] = pd.to_datetime(df[date_col])
    df.rename(columns={date_col: 'ds'}, inplace=True)

    df1 = df.rename(columns={target_col: 'y'})

    if df[target_col].dtype not in NUMERIC_DTYPES:
        # Remove commas from the column
        df1['y'] = df1['y'].str.replace(',', '')

        # Convert the column to float
        df1['y'] = df1['y'].astype(float)

    model = Prophet()

    # Fit the model
    model.fit(df1)

    # Create a DataFrame for future predictions
    future = model.make_future_dataframe(periods=period, freq=cycle_type)

    # Make predictions
    forecast = model.predict(future)

    image_buffer = io.BytesIO()

    # Plot the forecast
    model.plot(forecast, xlabel='Date', ylabel=target_col)
    plt.title('Forecast')
    #plt.show()
    plt.savefig(image_buffer, format="png")
    image_buffer.seek(0)

    # Save the image to a file
    image_path = 'forecast_image.png'
    save_to_image_file(image_buffer, image_path)

    # Upload the image to S3
    s3_key = 'forecast_image.png'
    upload_to_s3(image_path, s3_key)

    # Construct the S3 URL for the uploaded image
    s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/images/{s3_key}"

    model.plot_components(forecast)

    image_buffer2 = io.BytesIO()
    plt.title("Overall Trends")
    # plt.show()
    plt.savefig(image_buffer2, format="png")
    image_buffer2.seek(0)

    # Save the second image to a file
    image_path2 = 'trends_image.png'
    save_to_image_file(image_buffer2, image_path2)

    # Upload the second image to S3
    s3_key2 = 'trends_image.png'
    upload_to_s3(image_path2, s3_key2)

    # Construct the S3 URL for the second uploaded image
    s3_url2 = f"https://{BUCKET_NAME}.s3.amazonaws.com/images/{s3_key2}"

    pipeline = PipelineFactory.get("662c200879ba53d258e1ba8e")
    # Run the pipeline. Inputs can be URLs, file paths, or direct text/labels (if applicable).
    result1 = pipeline.run({
        "Input 1": "The following chart shows fb prophet predections for data given by a user.  Describe the following forcasting results in the chart for business level.",
        "Input 2": s3_url,  # Use the S3 URL for the forecast image
    })

    # Extract the URL from the response
    url = result1['data'][0]['segments'][0]['response']

    # Download the content from the URL
    downloaded_content = requests.get(url)

    # Read the content as text
    text_content = downloaded_content.text

    # Print the text content
    print(text_content)

    pipeline = PipelineFactory.get("662c200879ba53d258e1ba8e")
    # Run the pipeline. Inputs can be URLs, file paths, or direct text/labels (if applicable).
    result2 = pipeline.run({
        "Input 1": "The following chart shows fb prophet predections for data given by a user.  Describe the following forcasting results in the chart for business level.",
        "Input 2": s3_url2,  # Use the S3 URL for the forecast image
    })

    url = result2['data'][0]['segments'][0]['response']
    # Download the content from the URL
    downloaded_content = requests.get(url)

    # Read the content as text
    text_content2 = downloaded_content.text

    # Print the text content
    print(text_content2)

    return {
        target_col :[
            {
                'photo_url': s3_url,
                'insights': text_content
            },
            {
                'photo_url': s3_url2,
                'insights': text_content2
            }
        ]
    }

