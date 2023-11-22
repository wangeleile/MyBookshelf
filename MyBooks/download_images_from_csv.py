import csv
import requests
from pathlib import Path

# Function to download images from a list of URLs
def download_images_from_csv(csv_file_path, download_folder):
    # Create a folder for downloads if it doesn't exist
    Path(download_folder).mkdir(parents=True, exist_ok=True)
    
    # Open the CSV file containing the URLs
    with open(csv_file_path, encoding='utf-8') as csvfile:
        image_urls = csv.reader(csvfile)
        for i, row in enumerate(image_urls):
            # Assuming the URL is in the first column
            url = row[30]
            print(f"Downloading image {i} from {url}")
            try:
                # Send a GET request to the URL
                response = requests.get(url)
                # Check if the request was successful
                if response.status_code == 200:
                    # Open file in binary write mode and save the image
                    with open(Path(download_folder) / f'image_{row[0]}.jpg', 'wb') as f:
                        f.write(response.content)
                else:
                    print(f"Failed to download {url}. Status code: {response.status_code}")
            except Exception as e:
                print(f"An error occurred while downloading {url}. Error: {e}")

# Example usage:
csv_file_path = './MyBooks/enriched_books.csv'  # Replace with the path to your CSV file
download_folder = './MyBooks/bookimages'  # Replace with your desired download path

# Call the function
download_images_from_csv(csv_file_path, download_folder)