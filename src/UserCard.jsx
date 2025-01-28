import { useState } from "react";

const UserCard = ({ name, score, HandleRoundChange, isHost }) => {
    return (
        <div className="user-card">
            <div className="user-info">
                {(isHost? <p className="user-name">{name} 莊</p>: <p className="user-name">{name}</p>)}
                <p className={score > 0 ? 'score-positive' : score < 0 ? 'score-negative' : 'score-zero'}>{score}</p>
            </div>
            <div className="score-controls">
                <button onClick={HandleRoundChange}>食糊</button>
            </div>
        </div>
    );
};

export default UserCard;