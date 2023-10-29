import { appendResponse, getNextQuestion } from '../Helper/Helper'

interface Props {
    choiceText: string
    selectedChoices: Array<string>
    setSelectedChoices: SetStateType<Array<string>>
    changePage: (newPage: Page, responseChain?: ResponseChain) => void
    responseChain?: ResponseChain
    setQuestion: (value: string) => void
    setChoices: (value: Array<string>) => void
    setResponseChain?: (value: ResponseChain) => void
    setRestaurantId: (value: Array<string>) => void
}

function Choice({
    choiceText,
    selectedChoices,
    setSelectedChoices,
    changePage,
    responseChain,
    setChoices,
    setQuestion,
    setResponseChain,
    setRestaurantId,
}: Props) {
    return (
        <div
            className="rounded-3xl hover:bg-gray-100"
            onClick={() => {
                setSelectedChoices([choiceText])
                appendResponse(responseChain!, [...selectedChoices, choiceText])
                console.error(setResponseChain)
                getNextQuestion(responseChain!, { setQuestion, setChoices }, setResponseChain!, setRestaurantId, changePage)
                changePage('questionnaire', responseChain!)
            }}
        >
            <li key={choiceText} className="mb-8 cursor-pointer p-2">
                <label className="inline-flex items-center">
                    <span className="ml-2 text-xl">{choiceText}</span>
                </label>
            </li>
        </div>
    )
}

export default Choice
