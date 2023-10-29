import { MouseEvent } from 'react'
import Question from './Question'
import { checkResult, showResult, getNextQuestion, appendResponse, sendResponse } from '../Helper/Helper'

import './../index.css'
import Choice from './Choice'

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
        <div>
            <h2 className="mb-4 flex justify-around pt-10 text-7xl font-bold italic text-white"> Come babe, let me help you decide</h2>

            <div className="mt-20 flex justify-center">
                <div>
                    <Question question={question} />
                </div>
                <div className="p-4">
                    <ul>
                        {choices.map((choice) => (
                            <Choice choiceText={choice} />
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
