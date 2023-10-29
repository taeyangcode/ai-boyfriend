import { MouseEvent, useState } from 'react'
import Question from './Question'
import { checkResult, showResult, getNextQuestion, appendResponse } from '../Helper/Helper'

import './../index.css'
import Choice from './Choice'

interface Props {
    changePage: (newPage: Page, responseChain?: ResponseChain) => void
    question: string
    setQuestion: (value: string) => void
    choices: Array<string>
    setChoices: (value: Array<string>) => void
    responseChain?: ResponseChain
    setResponseChain?: (value: ResponseChain) => void
    setRestaurantId: (value: Array<string>) => void
}

function QuestionScreen({
    question,
    choices,
    setChoices,
    setQuestion,
    changePage,
    responseChain,
    setResponseChain,
    setRestaurantId,
}: Props) {
    console.info('response chain QUESTION: ', responseChain)
    // function to make API post requests with obtained results
    const [selectedChoices, setSelectedChoices] = useState<Array<string>>([])

    return (
        <div className="flex justify-center">
            <div className="w-1/2 items-center justify-center">
                <h2 className="mb-4 flex justify-center pt-10 text-7xl font-bold italic text-white"> Come babe, let me help you decide</h2>

                <div className="mt-20 justify-center rounded-3xl bg-white">
                    <div className="p-10">
                        <Question question={question} />
                    </div>
                    <div className="px-8 py-4">
                        <ul>
                            {choices.map((choice) => (
                                <Choice
                                    responseChain={responseChain}
                                    choiceText={choice}
                                    selectedChoices={selectedChoices}
                                    setSelectedChoices={setSelectedChoices}
                                    changePage={changePage}
                                    setRestaurantId={setRestaurantId}
                                    setQuestion={setQuestion}
                                    setChoices={setChoices}
                                    setResponseChain={setResponseChain}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Questionnaire({
    changePage,
    question,
    setQuestion,
    choices,
    setChoices,
    responseChain,
    setResponseChain,
    setRestaurantId,
}: Props) {
    console.info('response chain 1', responseChain)

    // function submitChoice(event: MouseEvent<HTMLButtonElement>) {
    //     event.preventDefault()
    // }

    return (
        <div>
            <QuestionScreen
                changePage={changePage}
                question={question}
                setQuestion={setQuestion}
                choices={choices}
                setChoices={setChoices}
                responseChain={responseChain}
                setResponseChain={setResponseChain}
                setRestaurantId={setRestaurantId}
            />
        </div>
    )
}

export default Questionnaire
