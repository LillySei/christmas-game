import '../index.css';
import './Game.css';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Game() {
    const [score, setScore] = useState(0);
    const [missed, setMissed] = useState(0);
    const [gifts, setGifts] = useState([]);
    const giftArray = [];
    const navigate = useNavigate();
    const [bagPosition, setBagPosition] = useState(50);
    const bagPositionRef = useRef(50);
    const [giftInterval, setGiftInterval] = useState(2000); // Startet bei 2s
    const [movementInterval, setMovementInterval] = useState(100); // Startet bei 100ms
    const [fallSpeed, setFallSpeed] = useState(1); // Startet mit 1% pro Tick

    for (let i = 1; i <= 20; i++) {
        giftArray.push(`/assets/images/gift${i}.png`);
    }

    // Geschenk erzeugen
    const createGift = () => {
        const randomX = Math.random() * 90;
        const randomGiftIndex = Math.floor(Math.random() * giftArray.length);
        const id = Date.now();
        setGifts((prevGifts) => [
            ...prevGifts,
            { id, left: `${randomX}%`, top: 0, speed: fallSpeed, image: giftArray[randomGiftIndex] }
        ]);
    };

    // Geschenke nach unten bewegen
    const moveGifts = () => {
        setGifts((prevGifts) =>
            prevGifts
                .map((gift) => {
                    const newTop = gift.top + gift.speed; // Geschwindigkeit beachten!
                    const giftPosition = parseFloat(gift.left);

                    if (newTop > 80) {
                        if (Math.abs(giftPosition - bagPositionRef.current) < 10) {
                            setScore((prevScore) => prevScore + 1);
                            return null;
                        }
                        if (newTop > 100) {
                            setMissed((prevMissed) => prevMissed + 1);
                            return null;
                        }
                    }

                    return { ...gift, top: newTop };
                })
                .filter(Boolean)
        );
    };

    // Sack mit den Pfeiltasten bewegen
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                setBagPosition((prev) => {
                    const newPosition = Math.max(prev - 5, 0);
                    bagPositionRef.current = newPosition;
                    return newPosition;
                });
            }
            if (event.key === "ArrowRight") {
                setBagPosition((prev) => {
                    const newPosition = Math.min(prev + 5, 85);
                    bagPositionRef.current = newPosition;
                    return newPosition;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Intervalle für Geschenk-Erstellung und Bewegung
    useEffect(() => {
        const creationTimer = setInterval(createGift, giftInterval);
        const movementTimer = setInterval(moveGifts, movementInterval);

        return () => {
            clearInterval(creationTimer);
            clearInterval(movementTimer);
        };
    }, [giftInterval, movementInterval]);

    // Geschwindigkeitserhöhung alle 3 Sekunden
    useEffect(() => {
        const speedIncrease = setInterval(() => {
            setGiftInterval((prev) => Math.max(prev * 0.95, 500)); // Mindestens 500 ms
            setMovementInterval((prev) => Math.max(prev * 0.99, 20)); // Mindestens 20ms
            setFallSpeed((prev) => Math.min(prev + 0.1, 5)); // Maximal 5% pro Tick
        }, 3000);

        return () => clearInterval(speedIncrease);
    }, []);


    // Wenn zu viele Geschenke verpasst wurden, Game Over
    useEffect(() => {
        if (missed === 30) {
            navigate('/ende');
        }
    }, [missed, navigate]);

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen-custom">
                <div className="score flex flex-row space-x-10">
                    <p>Your score: {score}</p>
                    <p>Missed presents: {missed}</p>
                </div>
                <div className="gameboard lg:w-10/12 lg:h-3/4 sm:h-4/5 sm:w-11/12 bg-white border-4 border-red-700">
                    {gifts.map((gift) => (
                        <img
                            key={gift.id}
                            src={gift.image}
                            className="gift absolute"
                            style={{
                                left: gift.left,
                                top: `${gift.top}%`,
                            }}
                            alt="Gift"
                        />
                    ))}
                    <img src="/assets/images/sack.png"
                         alt="Geschenkesack"
                         className="sack"
                         style={{
                             left: `${bagPosition}%`,
                         }}
                    />
                </div>
            </div>
        </>
    );
}

export default Game;
