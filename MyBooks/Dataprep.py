import pandas as pd

import requests

def get_google_books_data(title, author):
    params = {
        'q': f'intitle:{title}+inauthor:{author}',
        'maxResults': 1,
        'printType': 'books',
        'key': 'AIzaSyBfsmpvdmzVj94N_OQPXLw2yNpQD_JBb6Q'
    }
    url = "https://www.googleapis.com/books/v1/volumes"
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['totalItems'] > 0:
            book_data = data['items'][0]['volumeInfo']
            return {
                'Publisher': book_data.get('publisher', ''),
                'PublishedDate': book_data.get('publishedDate', ''),
                'PageCount': book_data.get('pageCount', ''),
                'Categories': ', '.join(book_data.get('categories', [])),
                'AverageRating': book_data.get('averageRating', ''),
                'RatingsCount': book_data.get('ratingsCount', ''),
                'Description': book_data.get('description', '')
            }
    return {
        'Publisher': '',
        'PublishedDate': '',
        'PageCount': '',
        'Categories': '',
        'AverageRating': '',
        'RatingsCount': '',
        'Description': ''
    }

def enrich_goodreads_data(goodreads_csv, enriched_csv):
    # Read the Goodreads data
    df = pd.read_csv(goodreads_csv)

    # Add columns for the additional data
    additional_columns = ['Publisher', 'PublishedDate', 'PageCount', 'Categories', 'AverageRating', 'RatingsCount', 'Description']
    for col in additional_columns:
        df[col] = ''

    # Query Google Books API for each book
    for index, row in df.iterrows():
        print(f'Enriching data for {row["Title"]} by {row["Author"]}')
        additional_data = get_google_books_data(row['Title'], row['Author'])
        for key, value in additional_data.items():
            df.at[index, key] = value
    
    # Save the enriched data to a new CSV file
    df.to_csv(enriched_csv, index=False)
    print(f'Data enriched successfully, results saved to {enriched_csv}')

# Usage</selectedCode>

df = pd.DataFrame()
df.head()

enrich_goodreads_data('books.csv', 'enriched_books.csv')

