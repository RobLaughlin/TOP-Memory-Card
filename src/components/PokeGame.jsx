import "./PokeGame.css";
import { React, useRef, useEffect, useState } from "react";

function PokeGame({ cards, width, height, htmlProps }) {
    const canvasRef = useRef(null);
    const [deck, setDeck] = useState(cards);

    return (
        <canvas
            id="PokeGame"
            ref={canvasRef}
            width={width}
            height={height}
            {...htmlProps}
        ></canvas>
    );
}

export default PokeGame;
