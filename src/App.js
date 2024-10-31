// sort movies based on imdb rating, release date, or vote count
// search button that auto types into a google search in another page with the streaming sites for the movie (or link website that tracks that)
// on hover, poster opacity fades and buttons to search for similar movies, find it on streaming, imdb rating atc, appear

import React, {useState, useEffect} from 'react';
import config from './config';
import ReactDOM from 'react-dom/client';


function App() {
    const mykey = config.MY_KEY;
    const [data, setData] = useState(null);

    let input = document.getElementById("search").value;
    document.getElementById("movie-display").style.visibility = "hidden";
    document.getElementById("search-bar").classList.remove("search-bar-large");
    document.getElementById("search-bar").classList.add("search-bar-small");
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&query=${input}`);
            const jsonData = await response.json();
            const sortedData = jsonData.results.sort((a, b) => b.vote_count - a.vote_count);
            setData(sortedData);
            //console.log("data: ", data.results.title);
        };
        fetchData();
    }, [input]);
    const handleSort = (sortOption) => {
        console.log("DATA", data);
        const sortedData = [...data].sort((a, b) => b[sortOption] - a[sortOption]);
        setData(sortedData);
    }
    const sortDates = (sortOption) => {
        const sortedData = [...data].sort((a, b) => new Date(a[sortOption]) - new Date(b[sortOption]));
        setData(sortedData);
    }
    /*function addSuggestions() {
        console.log("DELAY");
        document.querySelectorAll(".suggestions-button").forEach(function(i) {
            i.addEventListener('click', () => {
                root.render (
                    <React.StrictMode>
                      <App />
                    </React.StrictMode>
                );
            });
        });
    }*/
    return (
        <div className='movie-container'>
            <div>
                <button className="sorting-buttons" onClick={() => handleSort('vote_count')}>Vote Count</button>
                <button className="sorting-buttons" id="rating" onClick={() => handleSort('vote_average')}>Rating</button>
                <button className="sorting-buttons" onClick={() => sortDates('release_date')}>Release Date</button>
            </div>
            <div className='movie-section'>
                    {data && data.map((item, index) => (
                        <MovieInfo data={data} key={index} item={item} />
                    ))}
            </div>
        </div>
    );
}
const sortMovies = (sorter) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render (
        <React.StrictMode>
            <App sortOption={sorter}/>
        </React.StrictMode>
    );
}
//data.data.sort((a, b) => b.rating - a.rating)

function MovieInfo({data, item}) {
    if (item.poster_path !== null) {
        function suggest() {
            console.log("CLICKED");
        }
        const streamLink = `https://www.justwatch.com/us/search?q=${item.title}`
        let posterPath = "https://image.tmdb.org/t/p/w300" + item.poster_path;
        return (
            <div className='movie-information'>
                <button><a href={streamLink} target='_blank'>Streaming</a></button>
                <button className='overview-button'>Overview</button>
                <button className='suggestions-button' onClick={suggest}>Suggestions</button>
                {data && <img className='movie-img' src={posterPath} />}
                {data && <h2 className='movie-names'>{item.title}</h2>}
                {/*console.log(data)*/}
                <MovieOverview data={data} item={item} />
            </div>
        );
    }
}
function MovieOverview({data, item}) {
    return (
        <div className='overview'>
            <p>{data && item.overview}</p>
        </div>
    );
}

export default App;