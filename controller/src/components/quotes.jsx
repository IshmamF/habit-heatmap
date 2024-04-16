import React, { useState, useEffect } from 'react';

const Quote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const fetchQuote = async () => {
            const category = 'change';
            const url = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': 'MqTrXKuy1zXQi8S49RNCNA==leho72JwM3kMtacL'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setQuote(data[0].quote); // Assuming the API returns an array of quotes, we take the first one
            } catch (error) {
                console.error('Failed to fetch the quote:', error);
            }
        };

        fetchQuote();
    }, []);

    return (
        <div>
            <p>{quote}</p>
        </div>
    );
};

export default Quote;


