from fastapi import FastAPI
import requests
import datetime
import pytz
from dotenv import load_dotenv
import os
import openai

load_dotenv()
app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")
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


## OPENAI API
@app.get("/ai_prompts")
async def get_ai_prompts():
    user_prompt = "Your goal is to narrow down the list of restaurants by generating a few questions for the user to answer to decide the most suitable restaurant. The questions should not include budget, distance to travel, time for the meal and dietary preferences. List of restaurants: Tartine Bakery, Zuni Café, State Bird Provisions, Nopa, Gary Danko, Swan Oyster Depot, Tadich Grill, Benu, Liholiho Yacht Club, House of Prime Rib, The Slanted Door, La Taqueria, El Farolito, Flour + Water, Burma Superstar, Foreign Cinema, Saison, Angler, Atelier Crenn"
    messages = [
        {"role": "user", "content": user_prompt},
    ]
    functions = [
        {
            "name": "get_ai_prompts",
            "description": "Get AI prompts given a list of restaurants",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompts": {
                        "type": "array",
                        "description": "The list of prompts used to narrow down the list of restaurants",
                        "items": {
                            "type": "object",
                            "properties": {
                                "question": {
                                    "type": "string",
                                    "description": "The question to ask the user",
                                },
                                "choices": {
                                    "type": "array",
                                    "description": "The choices for answers to the corresponding question",
                                    "items": {
                                        "type": "string",
                                        "properties": {
                                            "choice": {
                                                "type": "string",
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
    ]
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        functions=functions,
        function_call={"name": "get_ai_prompts"},
    )
    response_message = response["choices"][0]["message"]
    print(response)
    print(response_message)
    return {"message": "Get AI prompts"}
