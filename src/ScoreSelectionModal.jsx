import React, { useState } from 'react';

const ScoreSelectionModal = ({ users, winningUser, onClose }) => {
    const gameSettings = JSON.parse(localStorage.getItem('gameSetting')) || {};
    const minFan = gameSettings.min || 0; 
    const maxFan = gameSettings.max || 3; 
    const fanNumbers = Array.from({ length: maxFan - minFan + 1 }, (_, i) => minFan + i);
    
    // Set default state for selectedFan to minFan
    const [selectedFan, setSelectedFan] = useState(minFan);
    const [selectedLoserId, setSelectedLoserId] = useState(null);
    const [isSelfDraw, setIsSelfDraw] = useState(false);
    const [selectedSelfDrawFan, setSelectedSelfDrawFan] = useState(minFan);
    const [isBaoSelfDraw, setIsBaoSelfDraw] = useState(false);
    const [selectedBaoUserId, setSelectedBaoUserId] = useState(null);

    const handleConfirm = () => {
        // Log current state for debugging
        console.log("Confirmed Values:", {
            selectedFan,
            selectedLoserId,
            isSelfDraw,
            selectedSelfDrawFan,
            isBaoSelfDraw,
            selectedBaoUserId
        });
        
        onClose(selectedFan, selectedLoserId, isSelfDraw, selectedSelfDrawFan, isBaoSelfDraw, selectedBaoUserId);
    };

    return (
        <div className="modal">
            <h2>選擇番數和出銃玩家</h2>
            <div>
                <label>
                    <input 
                        type="checkbox" 
                        checked={isSelfDraw} 
                        onChange={() => {
                            setIsSelfDraw(prev => !prev);
                            // Reset selections when toggling 自摸
                            if (!isSelfDraw) { // When checked
                                setSelectedFan(minFan); // Reset to minFan
                                setSelectedLoserId(null);
                                setSelectedSelfDrawFan(minFan); // Reset self-draw fan selection
                                setIsBaoSelfDraw(false); // Reset 包自摸 state
                                setSelectedBaoUserId(null); // Reset 包自摸 user selection
                            }
                        }} 
                    />
                    自摸
                </label>
            </div>
            {!isSelfDraw && (
                <>
                    <div>
                        <label>選擇番數:</label>
                        <select value={selectedFan} onChange={(e) => setSelectedFan(Number(e.target.value))}>
                            {fanNumbers.map(fan => (
                                <option key={fan} value={fan}>{fan}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>選擇出銃玩家:</label>
                        {users.map(user => (
                            <div key={user.id}>
                                <input 
                                    type="radio" 
                                    name="loser" 
                                    value={user.id} 
                                    onChange={(e) => setSelectedLoserId(Number(e.target.value))}
                                    checked={selectedLoserId === user.id}
                                    disabled={winningUser === user.id}
                                />
                                {user.name}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {isSelfDraw && (
                <>
                    <div>
                        <label>選擇自摸番數:</label>
                        <select value={selectedSelfDrawFan} onChange={(e) => setSelectedSelfDrawFan(Number(e.target.value))}>
                            {fanNumbers.map(fan => (
                                <option key={fan} value={fan}>{fan}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={isBaoSelfDraw} 
                                onChange={() => setIsBaoSelfDraw(prev => !prev)} 
                            />
                            包自摸
                        </label>
                    </div>
                    {isBaoSelfDraw && (
                        <div>
                            <label>選擇包自摸玩家:</label>
                            {users.map(user => (
                                <div key={user.id}>
                                    <input 
                                        type="radio" 
                                        name="baoUser" 
                                        value={user.id} 
                                        onChange={(e) => setSelectedBaoUserId(Number(e.target.value))}
                                        checked={selectedBaoUserId === user.id}
                                        disabled={winningUser === user.id}
                                    />
                                    {user.name}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            <button onClick={handleConfirm}>確定</button>
            <button onClick={() => onClose(0, null, false)}>取消</button>
        </div>
    );
};

export default ScoreSelectionModal;