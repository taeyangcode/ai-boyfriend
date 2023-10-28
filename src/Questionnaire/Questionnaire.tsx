import './../index.css'
import Question from './Question'

interface Props {
    changePage: (newPage: Page) => void
    question: string
    setQuestion: (value: string) => void
    choices: Array<string>
    setChoices: (value: Array<string>) => void
}

function Questionnaire({
    changePage,
    question,
    setQuestion,
    choices,
    setChoices,
}: Props) {
    return (
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            <h2>{question}</h2>
            <Question question={question} />
        </div>
    )
}

export default Questionnaire
