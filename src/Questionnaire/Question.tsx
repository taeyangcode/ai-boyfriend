import '../index.css'

interface Props {
    question: string
}

function Question({ question }: Props) {
    return <div>{question}</div>
}

export default Question
