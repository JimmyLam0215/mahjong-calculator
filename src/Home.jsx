import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    const goSetting = () => {
        localStorage.clear();
        navigate('/setting');
    }
    const goCredits = () => {
        navigate('/credits');
    }

    const clearLocalStorage = () => {
        localStorage.clear();
    }

    return (
        <>
        <div>
            <div className="home">
                <h1>麻雀計數機</h1>
                <button onClick={goSetting} className="start-game">開檯</button>
                {/*<button onClick={clearLocalStorage} className="restart">重設計數機</button>*/}
                <button onClick={goCredits} className="credits">Credits</button>
                <button onClick={() => window.open("https://jimmylam0215.github.io/jimmy-website/", "_blank")}>Author</button>
            </div>
        </div>
        </>
    );
}

export default Home