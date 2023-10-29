import { appendResponse } from '../Helper/Helper'

interface Props {
    choiceText: string
    selectedChoices: Array<string>
    setSelectedChoices: SetStateType<Array<string>>
    changePage: SetStateType<Page>
    responseChain?: ResponseChain
}

function Choice({ choiceText, selectedChoices, setSelectedChoices, changePage, responseChain }: Props) {
    return (
        <li key={choiceText} className="mb-2">
            <label className="inline-flex items-center">
                <input
                    className="form-radio-custom"
                    name="question-options"
                    onClick={() => {
                        setSelectedChoices([...selectedChoices, choiceText])
                        appendResponse(responseChain!, selectedChoices)
                        changePage('questionnaire')
                    }}
                />
                <span className="ml-2">{choiceText}</span>
            </label>
        </li>
    )
}

export default Choice
