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
            className="rounded-3xl bg-gradient-to-r from-blue-300 to-blue-500 text-white transition duration-700 ease-in-out hover:from-orange-500 hover:to-orange-300"
            onClick={() => {
                setSelectedChoices([choiceText])
                appendResponse(responseChain!, selectedChoices)
                console.error(setResponseChain)
                getNextQuestion(responseChain!, { setQuestion, setChoices }, setResponseChain!, setRestaurantId, changePage)
                changePage('questionnaire', responseChain!)
            }}
        >
            <li key={choiceText} className="mb-8 flex cursor-pointer justify-end px-8 py-4">
                <label className="inline-flex items-center">
                    <span className="ml-2 text-2xl">{choiceText}</span>
                </label>
            </li>
        </div>
    )
}

export default Choice
