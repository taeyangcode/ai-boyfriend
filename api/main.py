from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import datetime
import pytz
from dotenv import load_dotenv
import os
import openai
from pydantic import BaseModel
from typing import List
from starlette.responses import FileResponse

## Load environment variables
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
yelp_api_key = os.getenv("YELP_API_KEY")

yelp_base_url = "https://api.yelp.com/v3/"
tz = pytz.timezone("America/Los_Angeles")


## Define models
class UserInput(BaseModel):
    longitude: float
    latitude: float
    price: int
    radius: int
    date: int
    dietary_preferences: List[str]


## Define apps
app = FastAPI(title="main app")
api_app = FastAPI(title="api app")
origins = ["http://localhost:8000"]
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/api", api_app)
app.mount("/", StaticFiles(directory="../dist", html=True), name="ui")


## MAIN APP
@app.get("/")
async def read_index():
    return FileResponse("../dist/index.html")


## API APP
@api_app.get("/")
async def test():
    return {"message": "Hello World"}


@api_app.post("/businesses")
async def get_businesses(input: UserInput):
    search_url = f"{yelp_base_url}businesses/search"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {yelp_api_key}",
    }
    payload = {
        "term": "food",
        "limit": 50,  # max of 50 results
        "longitude": input.longitude,
        "latitude": input.latitude,
        "price": enumerate_to(input.price),
        "radius": input.radius,
        "open_at": input.date,
    }
    response = requests.get(search_url, headers=headers, params=payload)
    if response.ok:
        return response.json()
    else:
        print(response.text)
        return {"error": response.status_code}


@api_app.post("/businesses/{id}")
async def get_business(id: str):
    search_url = f"{yelp_base_url}businesses/{id}"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {yelp_api_key}",
    }
    payload = {"business_id_or_alias": "id"}
    response = requests.get(search_url, headers=headers, params=payload)
    if response.ok:
        return response.json()
    else:
        return {"error": response.status_code}


## OPENAI API
@api_app.get("/ai_prompts")
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


## HELPERS
def enumerate_to(price: int):
    return [i for i in range(1, price + 1)]
