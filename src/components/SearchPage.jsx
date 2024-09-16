import React, { useState } from 'react';
import './SearchPage.css';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        // Simulate fetching results
        const fetchedResults = [
            { title: 'FreeCodeCamp', description: 'Learn to code for free.', link: 'https://www.freecodecamp.org/' },
            { title: 'MDN Web Docs', description: 'Comprehensive documentation for web developers.', link: 'https://developer.mozilla.org/en-US/' },
            { title: 'W3Schools', description: 'Web development tutorials and references.', link: 'https://www.w3schools.com/' },
            { title: 'Udemy', description: 'Online courses on various topics.', link: 'https://www.udemy.com/' },
            { title: 'Coursera', description: 'Courses from top universities.', link: 'https://www.coursera.org/' },
        ];

        // Filter results based on the query
        const filteredResults = fetchedResults.filter(result => 
            result.title.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filteredResults);
        setLoading(false);
        // Simulate AI response
        setAiResponse(`Here are some resources related to "${query}"`);
    };

    return (
        <div className="search-page">
            <div className="search-bar">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Ask me anything..." 
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            <div className="ai-response">
                {aiResponse && <p>{aiResponse}</p>}
            </div>
            <div className="results">
                {results.map((result, index) => (
                    <div key={index} className="result-item">
                        <h3>{result.title}</h3>
                        <p>{result.description}</p>
                        <a href={result.link} target="_blank" rel="noopener noreferrer">Learn More</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;
