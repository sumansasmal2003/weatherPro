import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Google Custom Search API Key and CX (Custom Search Engine ID)
const apiKey = 'AIzaSyArxl1iFW8-3phcb5v8RNJmkYjXWVqqODI';
// const apiKey = 'AIzaSyB2b4Mpl-TInooNl23S7qySrawL-NosNEw'
const cx = '76c279a9cbb2b487c';
// const cx = '93c4e1ef61cdf4035'

const PlaceDetails = () => {
    const { place } = useParams();  // Get the place from the route parameter
    const [placeInfo, setPlaceInfo] = useState('');
    const [placeImages, setPlaceImages] = useState([]);
    const [error, setError] = useState(null);

    // Fetch details from Google Search API
    const fetchPlaceDetails = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/customsearch/v1?q=${place}&key=${apiKey}&cx=${cx}&searchType=image` // Fetching image results
            );
            const items = response.data.items;

            // Check if there are results and concatenate snippets from multiple items
            if (items && items.length > 0) {
                const fullDescription = items.slice(0, 5)  // Take first 5 results
                    .map(item => item.snippet)  // Extract snippet from each result
                    .join(' ');  // Join them to create a more complete description

                setPlaceInfo(fullDescription);  // Set the concatenated description in state
                setPlaceImages(items.slice(0, 6).map(item => item.link));  // Get first 3 images
            } else {
                setPlaceInfo('No details found for this place.');
            }
        } catch (err) {
            setError('Failed to fetch place details.', err);
        }
    };

    useEffect(() => {
        fetchPlaceDetails();  // Fetch details when the component mounts
    }, [place]);  // Refetch if the place changes

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
        >
            <h1
                className="text-2xl font-bold mb-4"
            >
                {place}
            </h1>
            <div
                className="bg-white shadow-lg rounded-lg p-6 max-w-7xl"
            >
                {
                    error ?
                        (
                            <p
                                className="text-red-500"
                            >
                                {error}
                            </p>
                        )
                        :
                        (
                            <div
                                className='flex flex-col items-center justify-center'
                            >
                                <p
                                    className="mb-4"
                                >
                                    {placeInfo}
                                </p>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {placeImages.length > 0 && placeImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Image of ${place}`}
                                            className="rounded-lg shadow-md h-[15rem] w-[20rem]"
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default PlaceDetails;
