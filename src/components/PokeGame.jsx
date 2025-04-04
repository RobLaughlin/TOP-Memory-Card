import "./PokeGame.css";
import { cache, React, useEffect, useState } from "react";

const CARDS_TO_DRAW = 10;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function PokeGame({ cards }) {
    const [gameState, setGameState] = useState({
        currentScore: 0,
        bestScore: 0,
        clickedCards: new Set(),
    });

    const [deckTop, setDeckTop] = useState(cards.length === 0 ? null : 0);
    const [viewedCards, setViewedCards] = useState([]);
    const [cachedCards, setCachedCards] = useState([]);

    // Always use the first n cards from the decktop
    useEffect(() => {
        if (deckTop === null) {
            return;
        }

        // Check if we got any cards in the cache/memo
        if (cachedCards.length === 0) {
            setViewedCards(Array.from(drawCards(deckTop, CARDS_TO_DRAW)));
        } else {
            setViewedCards([...cachedCards]);
        }

        // Update the cache
        setCachedCards(
            Array.from(
                drawCards(
                    (deckTop + CARDS_TO_DRAW) % cards.length,
                    CARDS_TO_DRAW
                )
            )
        );
    }, [deckTop]);

    function cardClicked(cardKey) {
        const { currentScore, bestScore, clickedCards } = gameState;

        // If we clicked the card already, reset the game.
        if (clickedCards.has(cardKey)) {
            // Reset the game
            setGameState({
                currentScore: 0,
                bestScore,
                clickedCards: new Set(),
            });

            // Draw cards
            if (deckTop !== null) {
                const newStartIdx = (deckTop + CARDS_TO_DRAW) % cards.length;
                setDeckTop(newStartIdx);
            }
        }
        // Otherwise update the score and shuffle the viewed cards
        else {
            clickedCards.add(cardKey);
            setGameState({
                currentScore: currentScore + 1,
                bestScore: Math.max(bestScore, currentScore + 1),
                clickedCards,
            });
            shuffleArray(viewedCards);
            setViewedCards([...viewedCards]);
        }
    }

    function drawCards(startIdx, numCards) {
        // Check if there are even any cards to draw from
        if (startIdx === null) {
            return [];
        }

        // If there are cards available, create a new played hand
        const newPlayedCards = Array.from(Array(numCards).keys()).map((n) => {
            const idx = (startIdx + n + 1) % cards.length;
            return cards[idx];
        });

        return newPlayedCards;
    }

    function renderCard(card, hidden) {
        return (
            <img
                src={card.img}
                alt={`${card.name} Pokemon card`}
                id={card.id}
                key={card.id}
                className="card"
                onClick={() => {
                    cardClicked(card.id);
                }}
                style={{
                    display: hidden ? "none" : "block",
                }}
            />
        );
    }

    return (
        <div className="pokeGame">
            <header>
                <div className="titleContainer">
                    <h1 className="title">Pokemon Memory Game</h1>
                    <br />
                    <p className="description">
                        Score resets when the same card is clicked more than
                        once.
                    </p>
                </div>
                <div className="scoreContainer">
                    <p className="score">Score: {gameState.currentScore}</p>
                    <p className="bestScore">
                        Best score: {gameState.bestScore}
                    </p>
                </div>
            </header>
            <main>
                <div className="cardContainer">
                    {viewedCards.map((card) => renderCard(card, false))}
                    {cachedCards.map((card) => renderCard(card, true))}
                </div>
            </main>
        </div>
    );
}

export default PokeGame;
