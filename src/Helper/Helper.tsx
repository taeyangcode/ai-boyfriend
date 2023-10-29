export function checkResult(json: ResponseChain) {
    console.info('json', json)
    const have_result = json['latest_response']['function_call']['arguments']['have_result']
    return have_result
}

export function showResult(json: ResponseChain, setRestaurantId: SetStateType<Array<string>>, changePage: SetStateType<Page>) {
    const restaurantId = [json['latest_response']['function_call']['arguments']['result']]
    setRestaurantId(restaurantId)
    changePage('result')
}

export async function getNextQuestion(initialResponseJson: ResponseChain, questionAndChoices: QuestionAndChoices) {
    // Get questions and choices from get_question endpoint
    const response = await fetch('http://127.0.0.1:8000/api/get_question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: initialResponseJson['messages'],
        }),
    })
    const responseJson = await response.json()
    console.log('response json', responseJson)

    // Store response of question and choice
    const questionResponse = JSON.parse(responseJson['latest_response']['function_call']['arguments'])
    questionAndChoices.setQuestion(questionResponse['question'])
    questionAndChoices.setChoices(questionResponse['choices'])

    console.log('question: ', questionResponse['question'])
    console.log('choices: ', questionResponse['choices'])
}

export function appendResponse(json: ResponseChain, choices: Array<string>) {
    const userResponse: UserResponse = {
        role: 'user',
        content: choices.toString(),
    }
    console.info('user response', userResponse)
    console.info('json', json)
    json['messages'].push(userResponse)
}

export async function sendResponse(json: ResponseChain) {
    await fetch('http://127.0.0.1:8000/api/get_question', { method: 'POST', body: JSON.stringify(json.messages) })
}
