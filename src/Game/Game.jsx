import '../index.css';
import './Game.css';
import {useEffect,  useState} from "react";
import {useNavigate} from "react-router-dom";



function Game(){
    const [score, setScore] = useState(0);
    const [missed, setMissed] = useState(0);
    const [gifts, setGifts] = useState([]);
    const giftArray = [];
    const navigate = useNavigate();
    const [sackPosition, setSackPosition] = useState(50);

    for(let i = 1; i <= 20; i++){
        giftArray.push(`/assets/images/gift${i}.png`);
    }

    // Geschenk erzeugen
    const createGift = () => {
        const randomX = Math.random() * 90; // Zufällige X-Position (0-90% des Gameboards)
        const randomGiftIndex = Math.floor(Math.random() * giftArray.length); // Zufälliges Geschenk aus dem Array
        const id = Date.now(); // Eindeutige ID für das Geschenk
        setGifts((prevGifts) => [
            ...prevGifts,
            { id, left: `${randomX}%`, top: 0, image: giftArray[randomGiftIndex],}// Zufälliges Bild aus dem Array, // Starten am oberen Rand
        ]);
    };

    // Funktion, um die Geschenke nach unten zu bewegen
    const moveGifts = () => {
        setGifts((prevGifts) =>
            prevGifts
                .map((gift) => {
                    const newTop = gift.top + 1; // Bewegungsgeschwindigkeit (1px pro Tick)
                    if (newTop > 100) {
                        setMissed((prevMissed) => prevMissed + 1);
                        return null;
                    }
                    return { ...gift, top: newTop };
                })
                .filter(Boolean) // Entferne `null` Einträge
        );
    };

    // Geschenke kontinuierlich erstellen und bewegen
    useEffect(() => {
        const creationInterval = setInterval(createGift, 5000); // Alle 5 Sekunden neues Geschenk
        const movementInterval = setInterval(moveGifts, 100); // Bewegung alle 100ms
        return () => {
            clearInterval(creationInterval);
            clearInterval(movementInterval);
        };
    }, []);

    // Wenn missed === 20, navigiere zur End-Route
    useEffect(() => {
        if (missed === 20) {
            navigate('/ende');
        }
    }, [missed, navigate]); // Reagiere auf Änderungen des missed-Werts

    return(
        <>
            <div className=" flex flex-col items-center justify-center h-screen-custom">
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
                         className="sack" />
                </div>
            </div>
        </>

    )
}

export default Game;