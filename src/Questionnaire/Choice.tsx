interface Props {
    choiceText: string
}

function Choice({ choiceText }: Props) {
    return (
        <li key={choiceText} className="mb-2">
            <label className="inline-flex items-center">
                <input type="radio" className="form-radio-custom" name="question-options" value={choiceText} />
                <span className="ml-2">{choiceText}</span>
            </label>
        </li>
    )
}

export default Choice
