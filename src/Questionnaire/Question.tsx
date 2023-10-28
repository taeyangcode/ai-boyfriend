import '../index.css'

interface Props {
    question: string
}

function Question({ question }: Props) {
    return <h1>{question}</h1>
}

export default Question
