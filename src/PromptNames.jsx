import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PromptNames() {
    const [names, setNames] = useState([]);
    const [submitted, setSubmitted] = useState(false); // State to track submission
    const navigate = useNavigate();
    // Handle form submission
    const handleUserName = (event) => {
        event.preventDefault(); // Prevent the default form submission
        const form = event.target; // Get the form element

        // Collect names from the input fields
        const newNames = [
            form.user1.value,
            form.user2.value,
            form.user3.value,
            form.user4.value,
        ];

        // Update the names state
        setNames(newNames);
        navigate('/main-page', { state: { names: newNames } });
    };


    return (
        <>
            <form onSubmit={handleUserName}>
                <h2>請輸入玩家嘅名:</h2>
                <label htmlFor="user1">玩家一:</label>
                <input type="text" name="user1" id="user1" required /> <br />
                <label htmlFor="user2">玩家二:</label>
                <input type="text" name="user2" id="user2" required /> <br />
                <label htmlFor="user3">玩家三:</label>
                <input type="text" name="user3" id="user3" required /> <br />
                <label htmlFor="user4">玩家四:</label>
                <input type="text" name="user4" id="user4" required /> <br />
                <button type="submit">確定</button>
            </form>
        </>
    );
}

export default PromptNames;