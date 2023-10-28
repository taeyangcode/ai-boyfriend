from fastapi import FastAPI
import requests
import datetime
import pytz
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

yelp_api_key = os.getenv("YELP_API_KEY")
yelp_base_url = "https://api.yelp.com/v3/"
tz = pytz.timezone("America/Los_Angeles")


@app.get("/")
async def root():
    return {"message": "Hello World"}


## YELP API
@app.get("/businesses")
async def get_businesses():
    search_url = f"{yelp_base_url}businesses/search"
    dt = datetime.datetime(2023, 10, 27, 12, 30, tzinfo=tz)
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {yelp_api_key}",
    }
    payload = {
        "term": "food",
        "location": "San Francisco",  ## either location or latitude + longitude is required for call
        "price": [1, 2, 3],
        "radius": 2000,
        "open_at": int(dt.timestamp()),
    }
    response = requests.get(search_url, headers=headers, params=payload)
    if response.ok:
        return response.json()
    else:
        return {"error": response.status_code}
