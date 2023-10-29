interface Props {
    businessData: YelpBusiness
}

function LocationCard({ businessData }: Props) {
    const { name, image_url, display_phone, categories, location, url } = businessData
    const { address1, address2, address3, city, zip_code, country, state } = location

    return (
        <div className="max-w-lg overflow-hidden rounded shadow-lg">
            <img className="w-fit" src={image_url} />
            <div className="px-6 py-4">
                <div className="mb-2 text-xl font-bold">{name}</div>
                <div className="px-1 py-2">
                    <p className="text-base font-bold text-black">Address:</p>
                    <p className="text-base text-gray-700">{`${address1} ${address2} ${address3} ${city} ${state} ${zip_code}`}</p>
                </div>

                <div className="px-1 py-2">
                    <p className="text-base font-bold text-black">Phone Number:</p>
                    <p className="text-base text-gray-700">{display_phone}</p>
                </div>

                <div className="flex justify-center px-1 py-2">
                    <a
                        href={url}
                        className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        See on Yelp
                    </a>
                </div>
            </div>
            <div className="px-6 pb-2 pt-4">
                {categories?.map((category) => (
                    <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                        {category.title}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default LocationCard
