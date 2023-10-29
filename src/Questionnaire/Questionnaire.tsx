import { MouseEvent } from 'react'
import Question from './Question'
import { checkResult, showResult, getNextQuestion, appendResponse, sendResponse } from '../Helper/Helper'

import './../index.css'

interface Props {
    changePage: (newPage: Page) => void
    question: string
    setQuestion: (value: string) => void
    choices: Array<string>
    setChoices: (value: Array<string>) => void
}

function QuestionScreen({ question, choices }: Props) {
    // function to make API post requests with obtained results

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
                            <li key={choice} className="mb-2">
                                <label className="inline-flex items-center">
                                    <input type="radio" className="form-radio-custom" name="question-options" value={choice} />
                                    <span className="ml-2">{choice}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

function Questionnaire({ changePage, question, setQuestion, choices, setChoices }: Props) {
    const haveResult = false

    function submitChoice(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        changePage('result')
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
