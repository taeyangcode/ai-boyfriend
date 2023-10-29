from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import datetime
import pytz
from dotenv import load_dotenv
import os
import openai
from pydantic import BaseModel, Field
from typing import List, Optional
from starlette.responses import FileResponse

## Load environment variables
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
yelp_api_key = os.getenv("YELP_API_KEY")
googleGeoLoc_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

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


<<<<<<< HEAD

class Message(BaseModel):
    role: str
    content: Optional[str] = None
    function_call: Optional[dict] = None

    def to_dict(self):
        if self.role == "user":
            return self.dict(exclude={"function_call"})
        return self.dict()


class Messages(BaseModel):
    messages: list[Message]


class AIInput(BaseModel):
    input: UserInput
    messages: Optional[List[dict]] = None


=======
>>>>>>> bbbae32 (merge)
class GeoInput(BaseModel):
    address: str
    city: str
    state: str

<<<<<<< HEAD

=======
>>>>>>> bbbae32 (merge)
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


<<<<<<< HEAD
<<<<<<< HEAD
## GOOGLE GEOLOCATION API
@api_app.post("/geolocation")

async def get_coordinates_forAddress(input: GeoInput):
    api_url = "https://maps.googleapis.com/maps/api/geocode/json"

    params = {
        "address": input.address + ", " + input.city + ", " + input.state,
        "key": googleGeoLoc_api_key,
    }

    try:
        response = requests.get(api_url, params=params)
        data = response.json()
            
        print("DEBUG") 
        print(data)
        print("DEBUG")
        if data.get("status") == "OK":

            result = data["results"][0]
            location = result["geometry"]["location"]
            lat = location["lat"]
            lng = location["lng"]
            return {"lat": lat, "lng": lng}
        else:
            return None

    except Exception as e:
        print("Error fetching coordinates:", str(e))
        return None
=======
<<<<<<< HEAD
>>>>>>> bbbae32 (merge)
=======
>>>>>>> 1516a33 (geographic location info adding)
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
## GOOGLE GEOLOCATION API
@api_app.post("/geolocation")

async def get_coordinates_forAddress(input: GeoInput):
    api_url = "https://maps.googleapis.com/maps/api/geocode/json"

    params = {
        "address": input.address + ", " + input.city + ", " + input.state,
        "key": googleGeoLoc_api_key,
    }

    try:
        response = requests.get(api_url, params=params)
        data = response.json()
            
        print("DEBUG") 
        print(data)
        print("DEBUG")
        if data.get("status") == "OK":

            result = data["results"][0]
            location = result["geometry"]["location"]
            lat = location["lat"]
            lng = location["lng"]
            return {"lat": lat, "lng": lng}
        else:
            return None

    except Exception as e:
        print("Error fetching coordinates:", str(e))
        return None


## OPENAI API
@api_app.post("/get_question")
async def get_question(messages: Messages):
    print(messages)
    functions = [
        {
            "name": "get_question",
            "description": "Get question to narrow down list of restaurants",
            "parameters": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "object",
                        "description": "The question to ask the user together with the choices for answers if have_result = false",
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
                        "required": ["question", "choices"],
                    },
                },
                "required": ["question"],
            },
        }
    ]
    messages_formatted = [message.to_dict() for message in messages.messages]
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages_formatted,
        functions=functions,
        function_call={"name": "get_question"},
    )
    response_message = response["choices"][0]["message"]
    print(response)
    print(response_message)
    messages_formatted.append(response_message)

    return {
        "latest_response": response_message,
        "messages": messages_formatted,
    }


@api_app.post("/get_result")
async def get_result(ai_input: AIInput):
    radius = ai_input.input.radius
    latitude = ai_input.input.latitude
    longitude = ai_input.input.longitude

    yelp_response = await get_businesses(ai_input.input)
    list_of_restaurants = [business["name"] for business in yelp_response["businesses"]]
    mapped_response = [
        {
            "id": business["id"],
            "name": business["name"],
            "review_count": business["review_count"],
            "categories": business["categories"],
            "rating": business["rating"],
            "is_closed": business["is_closed"],
            "distance": business["distance"],
        }
        for business in yelp_response["businesses"]
    ]
    user_prompt = f"Your goal is to narrow down the list of restaurants to a specific restaurant by asking the user questions using the information in JSON provided, 1 question at a time with choices. The user wants to dine within {radius}m of coordinates ({latitude}, {longitude}) on Monday, 2pm. List of restaurants: {list_of_restaurants}. Information about each restaurant: {mapped_response}"
    messages = (
        ai_input.messages
        if ai_input.messages
        else [
            {"role": "user", "content": user_prompt},
        ]
    )
    functions = [
        {
            "name": "get_result",
            "description": "Get id and name of restaurant decided from user preferences",
            "parameters": {
                "type": "object",
                "properties": {
                    "have_result": {
                        "type": "boolean",
                        "description": "Whether the model has a final result from the list of restaurants",
                    },
                    "result": {
                        "type": "object",
                        "description": "The final result from the list of restaurants",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "The id of the restaurant",
                            },
                            "name": {
                                "type": "string",
                                "description": "The name of the restaurant",
                            },
                        },
                    },
                },
                "required": ["have_result"],
            },
        }
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        functions=functions,
        function_call={"name": "get_result"},
    )
    response_message = response["choices"][0]["message"]
    print(response)
    print(response_message)
    messages.append(response_message)
    return {
        "latest_response": response_message,
        "messages": messages,
        "yelp_response_mapped": mapped_response,
    }


@api_app.post("/ai_prompts")
async def get_ai_prompts(ai_input: AIInput):
    radius = ai_input.input.radius
    latitude = ai_input.input.latitude
    longitude = ai_input.input.longitude

    yelp_response = await get_businesses(ai_input.input)
    list_of_restaurants = [business["name"] for business in yelp_response["businesses"]]
    mapped_response = [
        {
            "id": business["id"],
            "name": business["name"],
            "review_count": business["review_count"],
            "categories": business["categories"],
            "rating": business["rating"],
            "is_closed": business["is_closed"],
            "distance": business["distance"],
        }
        for business in yelp_response["businesses"]
    ]
    user_prompt = f"Your goal is to narrow down the list of restaurants to a specific restaurant by asking the user questions using the information in JSON provided, 1 question at a time with choices. The user wants to dine within {radius}m of coordinates ({latitude}, {longitude}) on Monday, 2pm. List of restaurants: {list_of_restaurants}. Information about each restaurant: {mapped_response}"
    messages = (
        ai_input.messages
        if ai_input.messages
        else [
            {"role": "user", "content": user_prompt},
        ]
    )
    functions = [
        {
            "name": "get_question",
            "description": "Get question to narrow down list of restaurants",
            "parameters": {
                "type": "object",
                "properties": {
                    "have_result": {
                        "type": "boolean",
                        "description": "Whether the model has a final result from the list of restaurants",
                    },
                    "result": {
                        "type": "string",
                        "description": "The final result from the list of restaurants",
                    },
                    "question": {
                        "type": "object",
                        "description": "The question to ask the user together with the choices for answers if have_result = false",
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
                "required": ["have_result"],
            },
        }
    ]

    # messages.append(
    #     {
    #         "role": "assistant",
    #         "content": None,
    #         "function_call": {
    #             "name": "get_question",
    #             "arguments": '{\n  "have_result": false,\n  "question": {\n    "question": "What type of cuisine are you in the mood for?",\n    "choices": ["Mexican", "American", "Thai", "Italian", "French"]\n  }\n}',
    #         },
    #     }
    # )
    # messages.append({"role": "user", "content": "American"})
    # messages.append(
    #     {
    #         "role": "assistant",
    #         "content": None,
    #         "function_call": {
    #             "name": "get_question",
    #             "arguments": '{\n  "have_result": false,\n  "question": {\n    "question": "Would you prefer a burger joint or a more upscale dining experience?",\n    "choices": ["Burger joint", "Upscale dining"]\n  }\n}',
    #         },
    #     }
    # )
    # messages.append({"role": "user", "content": "Upscale dining"})
    # messages.append(
    #     {
    #         "role": "assistant",
    #         "content": None,
    #         "function_call": {
    #             "name": "get_question",
    #             "arguments": '{\n  "have_result": false,\n  "question": {\n    "question": "Do you prefer a place that also serves alcohol?",\n    "choices": ["Yes", "No"]\n  }\n}',
    #         },
    #     }
    # )
    # messages.append({"role": "user", "content": "Yes"})
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        functions=functions,
        function_call={"name": "get_question"},
    )
    response_message = response["choices"][0]["message"]
    print(response)
    print(response_message)
    messages.append(response_message)
    return {
        "latest_response": response_message,
        "messages": messages,
        "yelp_response_mapped": mapped_response,
    }






## HELPERS
def enumerate_to(price: int):
    return [i for i in range(1, price + 1)]
