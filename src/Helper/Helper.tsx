export function checkResult(json: ResponseChain) {
    const args = JSON.stringify(json['latest_response']['function_call']['arguments'])
    const parsedJSON = JSON.parse(JSON.parse(args))
    const have_result = parsedJSON['have_result']
    return have_result
}

export function showResult(json: ResponseChain, setRestaurantId: SetStateType<Array<string>>, changePage: SetStateType<Page>) {
    const restaurantId = [JSON.parse(JSON.parse(JSON.stringify(json['latest_response']['function_call']['arguments'])))['result']['id']]
    console.log('restaurant id', restaurantId)
    setRestaurantId(restaurantId)
    changePage('result')
}

export async function getNextQuestion(
    responseChain: ResponseChain,
    questionAndChoices: QuestionAndChoices,
    setResponseChain: SetStateType<ResponseChain>,
    setRestaurantId: SetStateType<Array<string>>,
    changePage: SetStateType<Page>
) {
    // Get questions and choices from get_question endpoint
    const response = await fetch('http://127.0.0.1:8000/api/get_question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: responseChain['messages'],
        }),
    })
    const responseJson = await response.json()
    console.log('response json', responseJson)

    setResponseChain(responseJson)

    // Store response of question and choice
    const questionResponse = JSON.parse(responseJson['latest_response']['function_call']['arguments'])
    const haveResult = questionResponse['have_result']
    if (haveResult) {
        getResult(responseChain, setResponseChain, setRestaurantId, changePage)
    } else {
        questionAndChoices.setQuestion(questionResponse['question'])
        questionAndChoices.setChoices(questionResponse['choices'])

        console.log('question: ', questionResponse['question'])
        console.log('choices: ', questionResponse['choices'])
    }
}

export async function getResult(
    responseChain: ResponseChain,
    setResponseChain: SetStateType<ResponseChain>,
    setRestaurantId: SetStateType<Array<string>>,
    changePage: SetStateType<Page>
) {
    // First response to check if there is already a result
    // If have_result is false, we continue to get more questions to ask the user to narrow down the list of restaurants
    console.log('response chain', responseChain)
    console.log('messages', responseChain.messages)
    console.log({ messages: responseChain.messages })
    const initialResponse = await fetch('http://127.0.0.1:8000/api/get_final_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: responseChain.messages }),
    })
    const initialResponseJson = await initialResponse.json()
    console.log('get result response', initialResponseJson)

    // Show results page if result is found; Go through questionnaire if not;
    showResult(initialResponseJson, setRestaurantId, changePage)
}

export function appendResponse(json: ResponseChain, choices: Array<string>) {
    const userResponse: UserResponse = {
        role: 'user',
        content: choices.toString(),
    }
    json['messages'].push(userResponse)
}
