import React from 'react';

const UserReplacement = ({
    users,
    replacementType,
    setReplacementType,
    newUserName,
    setNewUserName,
    selectedUserId,
    setSelectedUserId,
    secondSelectedUserId,
    setSecondSelectedUserId,
    resetScore,
    setResetScore,
    handleReplaceUser,
    showReplacement,
    setShowReplacement,
}) => {
    return (
        <div className='replacement-form'>
            <h3>{replacementType === 'replace' ? "換人" : "換位"}</h3>
            {replacementType === 'replace' && (
                <>
                    <input 
                        type="text" 
                        placeholder="新玩家名稱" 
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)} 
                    />
                    <div>
                        <label>要換走邊個?</label>
                        {users.map(user => (
                            <div key={user.id}>
                                <input 
                                    type="radio" 
                                    value={user.id} 
                                    checked={selectedUserId === user.id} 
                                    onChange={() => setSelectedUserId(user.id)} 
                                />
                                {user.name}
                            </div>
                        ))}
                    </div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={resetScore} 
                            onChange={(e) => setResetScore(e.target.checked)} 
                        />
                        重置該玩家分數
                    </label>
                    <br />
                    <button onClick={handleReplaceUser}>確定</button>
                </>
            )}
            {replacementType === 'swap' && (
                <>
                    <div>
                        <label>揀第一個玩家:</label>
                        {users.map(user => (
                            <div key={user.id}>
                                <input 
                                    type="radio" 
                                    value={user.id} 
                                    checked={selectedUserId === user.id} 
                                    onChange={() => {
                                        setSelectedUserId(user.id);
                                        setSecondSelectedUserId(null); // Reset second user
                                    }} 
                                />
                                {user.name}
                            </div>
                        ))}
                    </div>
                    <br />
                    <div>
                        <label>揀第二個玩家:</label>
                        {users.map(user => (
                            <div key={user.id}>
                                <input 
                                    type="radio" 
                                    value={user.id} 
                                    checked={secondSelectedUserId === user.id} 
                                    onChange={() => setSecondSelectedUserId(user.id)} 
                                    disabled={user.id === selectedUserId} 
                                />
                                {user.name}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleReplaceUser} disabled={!selectedUserId || !secondSelectedUserId}>確定</button>
                </>
            )}
            <button onClick={() => setShowReplacement(false)}>撳錯</button>
        </div>
    );
};

export default UserReplacement;