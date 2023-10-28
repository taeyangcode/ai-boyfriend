import './../index.css'

interface Props {
    locationIds: Array<string>
}

function Result({ locationIds }: Props) {
    return (
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Pls choose more</h2>
        </div>
    )
}

export default Result
