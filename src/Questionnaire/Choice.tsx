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
        <li key={choiceText} className="mb-2">
            <label className="inline-flex items-center">
                <input
                    className="form-radio-custom"
                    name="question-options"
                    onClick={() => {
                        setSelectedChoices([choiceText])
                        appendResponse(responseChain!, selectedChoices)
                        console.error(setResponseChain)
                        getNextQuestion(responseChain!, { setQuestion, setChoices }, setResponseChain!, setRestaurantId, changePage)
                        changePage('questionnaire', responseChain!)
                    }}
                />
                <span className="ml-2">{choiceText}</span>
            </label>
        </li>
    )
}

export default Choice
