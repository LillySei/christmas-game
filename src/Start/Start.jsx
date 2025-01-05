import '../index.css';
import './Start.css'
import {useNavigate} from "react-router-dom";


function Start() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/spiel'); // Ersetze '/neue-route' durch den gewünschten Pfad
    };

    return (
        <div className="flex items-center justify-center ml-2 mr-2 md:ml-20 md:mr-20 h-screen-custom2">
            <div className="flex flex-col justify-start mb-20 text-center">
                <div className="m-10">
                    <p>Santa&#39;s got a gift crisis! Help him grab those presents before the reindeer eat them!</p>
                    <br/>
                    <p>Click start to save Christmas. Ho ho ho!</p>
                </div>
                <div className="">
                    <button className="start-button pl-4 pr-4 pt-2 pb-2" onClick={handleButtonClick}>Start Game</button>
                </div>
            </div>
        </div>
    );
}

export default Start;

