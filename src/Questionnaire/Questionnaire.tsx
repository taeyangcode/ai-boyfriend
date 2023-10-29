import { MouseEvent, useState } from 'react'
import Question from './Question'
import { checkResult, showResult, getNextQuestion, appendResponse, sendResponse } from '../Helper/Helper'

import './../index.css'
import Choice from './Choice'

interface Props {
    changePage: (newPage: Page, responseChain?: ResponseChain) => void
    question: string
    setQuestion: (value: string) => void
    choices: Array<string>
    setChoices: (value: Array<string>) => void
    responseChain?: ResponseChain
}

function QuestionScreen({ question, choices, setChoices, setQuestion, changePage, responseChain }: Props) {
    console.info('response chain QUESTION: ', responseChain)
    // function to make API post requests with obtained results
    const [selectedChoices, setSelectedChoices] = useState<Array<string>>([])

    return (
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Babe, let me help you to decide 😉</h2>

            <div className="mt-20 flex">
                <div>
                    <Question question={question} />
                </div>
                <div className="w-1/2 p-4">
                    <ul>
                        {choices.map((choice) => (
                            <Choice
                                responseChain={responseChain}
                                choiceText={choice}
                                selectedChoices={selectedChoices}
                                setSelectedChoices={setSelectedChoices}
                                changePage={changePage}
                                setQuestion={setQuestion}
                                setChoices={setChoices}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

function Questionnaire({ changePage, question, setQuestion, choices, setChoices, responseChain }: Props) {
    console.info('response chain 1', responseChain)

    const haveResult = false

    function submitChoice(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
    }

    return (
        <div>
            {!haveResult ? (
                <QuestionScreen
                    changePage={changePage}
                    question={question}
                    setQuestion={setQuestion}
                    choices={choices}
                    setChoices={setChoices}
                    responseChain={responseChain}
                />
            ) : (
                <>
                    <div>Alright I have something for you ❤️</div>
                    <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white" onClick={submitChoice}>
                        Show me
                    </button>
                </>
            )}
        </div>
    )
}

export default Questionnaire
