
import './App.css'
import {Route, Routes} from "react-router-dom";
import './index.css';
import Start from "./Start/Start.jsx";
import './App.css'
import Game from "./Game/Game.jsx";
import End from "./End/End.jsx";





function App() {

    return (
      <>
          <div id="border" className="border">
              <div className="innerBorder">
              <Routes>
                  <Route path="/" element={<Start/>} />
                  <Route path="/spiel" element={<Game/>} />
                 <Route path="/ende" element={<End/>} />
              </Routes>
              </div>
          </div>
      </>
  )
}

export default App;
