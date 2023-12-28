from flask import Flask
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def home():
    return 'Home Page Route'

URL = "https://www.coppercolorado.com/the-mountain/conditions-weather/snow-report"
page = requests.get(URL)

html_content = page.content
soup = BeautifulSoup(html_content, 'html.parser')

for row in soup.find_all('li'):
    data = row.get_text()
    print(data)