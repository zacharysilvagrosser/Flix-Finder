// sort movies based on imdb rating, release date, or vote count
// search button that auto types into a google search in another page with the streaming sites for the movie (or link website that tracks that)
// on hover, poster opacity fades and buttons to search for similar movies, find it on streaming, imdb rating atc, appear

import React, {useState, useEffect} from 'react';
import config from './config';


function App() {
    const mykey = config.MY_KEY;
    const [data, setData] = useState(null);

    let input = document.getElementById("search").value;
    console.log("INPUT:", input);
    document.getElementById("movie-display").style.visibility = "hidden";
    document.getElementById("search-bar").classList.remove("search-bar-large");
    document.getElementById("search-bar").classList.add("search-bar-small");
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&query=${input}`);
            const jsonData = await response.json();
            const sortedData = jsonData.results.sort((a, b) => b.vote_count - a.vote_count);
            setData(sortedData);
            console.log("SORTED", sortedData);
            //console.log("data: ", data.results.title);
        };
        fetchData();
    }, [input]);

    return (
        <div className='movie-container'>
            <div>
                <SortingButtons data={data}/>
            </div>
            <div className='movie-section'>
                    {data && data.map((item, index) => (
                        <MovieInfo data={data} key={index} item={item} />
                    ))}
            </div>
        </div>
    );
}

//data.data.sort((a, b) => b.rating - a.rating)
function SortingButtons(data) {
    function sortDataID() {
        const sorted = data.data.sort((a, b) => a.id - b.id);
        document.getElementsByClassName("sorting-buttons")[0].style.backgroundColor = "#021526";
        document.getElementsByClassName("sorting-buttons")[0].style.borderRadius = "8px";
        document.getElementsByClassName("sorting-buttons")[1].style.backgroundColor = "#021526";
        document.getElementsByClassName("sorting-buttons")[1].style.borderRadius = "8px";
        document.getElementsByClassName("sorting-buttons")[2].style.backgroundColor = "#03213b";
        document.getElementsByClassName("sorting-buttons")[2].style.borderRadius = "0px";
        console.log("SORTED NEW DATA: ", sorted);
    }
    function sortDataRating() {
        const sorted = data.data.sort((a, b) => b.vote_average - a.vote_average);
        document.getElementsByClassName("sorting-buttons")[0].style.backgroundColor = "#021526";
        document.getElementsByClassName("sorting-buttons")[0].style.borderRadius = "8px";
        document.getElementsByClassName("sorting-buttons")[1].style.backgroundColor = "#03213b";
        document.getElementsByClassName("sorting-buttons")[1].style.borderRadius = "0px";
        document.getElementsByClassName("sorting-buttons")[2].style.backgroundColor = "#021526";
        document.getElementsByClassName("sorting-buttons")[2].style.borderRadius = "8px";
        console.log("SORTED NEW DATA: ", sorted);
    }

    return (
        <>
            <button className="sorting-buttons">Vote Count</button>
            <button className="sorting-buttons" id="rating" onClick={sortDataRating}>Rating</button>
            <button className="sorting-buttons" onClick={sortDataID}>Release Date</button>
        </>
    )
}
function MovieInfo({data, item}) {
    if (item.poster_path !== null) {
        let posterPath = "https://image.tmdb.org/t/p/w300" + item.poster_path;
        return (
            <div className='homepage-link'>
                <MovieButtons data={data} item={item} />
                {data && <img src={posterPath} />}
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
            {/*console.log(item.overview)*/}
        </div>
    );
}
function MovieButtons({data, item}) {
    function displayOverview() {
        if (data) {
            document.querySelectorAll(".overview")[0].innerHTML = item.overview;
            document.querySelectorAll(".overview")[0].style.display = "block";
        }
    }
    function hideOverview() {
        if (data) {
            document.querySelectorAll(".overview")[0].style.display = "none";
        }
    }
    const streamLink = `https://www.justwatch.com/us/search?q=${item.title}`
    return (
        <div className='movie-buttons'>
            <button><a href={streamLink} target='_blank'>Streaming</a></button>
            <button onMouseOver={displayOverview} onMouseOut={hideOverview}>Overview</button>
        </div>
    );
}

export default App;