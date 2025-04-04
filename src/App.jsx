import "./App.css";

import { useEffect, useState } from "react";
import { fetchPokemon } from "./PokeAPI.js";
import { CircularProgress } from "@mui/material";

import PokeGame from "./components/PokeGame";

function App() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [pokeResponse, setPokeResponse] = useState({
        cards: [],
        error: null,
        loading: true,
    });

    function initRender() {
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Call from pokemon API to fetch pokemon cards
        fetchPokemon(3, "force-cache")
            .then((pokemon) => {
                const shuffledDeck = shuffle(Array.from(pokemon.values()));
                setPokeResponse({
                    cards: shuffledDeck,
                    error: null,
                    loading: false,
                });
            })
            .catch((err) => {
                setPokeResponse({
                    cards: [],
                    error: err,
                    loading: false,
                });
            });

        // Force a rerender on resize
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
    }
    useEffect(initRender, []);

    return (
        <div className="appContainer">
            {pokeResponse.loading ? (
                <div className="loadingContainer">
                    <CircularProgress size="33vw" id="GameLoadingIcon" />
                    <p className="loadingText">
                        Loading Pokemon memory game...
                    </p>
                </div>
            ) : pokeResponse.error === null ? (
                <PokeGame cards={pokeResponse.cards} />
            ) : (
                <div className="loadingContainer">
                    <p className="loadingText failed">
                        Failed to load the game, refresh or try again later.
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
