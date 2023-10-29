import '../index.css'

interface Props {
    question: string
}

function Question({ question }: Props) {
    return <div className="text-3xl">{question}</div>
}

export default Question
