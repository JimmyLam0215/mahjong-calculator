import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function HomeButton(){
    const location = useLocation();
    const navigate = useNavigate();
    const handleButtonClick = () =>{
        navigate("/");
    }
    if (location.pathname === '/') {
        return null; 
    }

    return (
        <button className="home-btn" onClick={handleButtonClick}>🏠︎</button>
    );
}

export default HomeButton;