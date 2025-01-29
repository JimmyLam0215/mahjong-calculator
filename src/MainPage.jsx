import UserCard from './UserCard';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
import UserReplacement from './UserReplacement'; 
import ScoreSelectionModal from './ScoreSelectionModal';

function MainPage() {
    const location = useLocation();
    const { names } = location.state || { names: [] };
    const [users, setUsers] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [currentWind, setCurrentWind] = useState(0);
    const [newUserName, setNewUserName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [secondSelectedUserId, setSecondSelectedUserId] = useState(null);
    const [resetScore, setResetScore] = useState(false);
    const [showReplacement, setShowReplacement] = useState(false);
    const [replacementType, setReplacementType] = useState(null); 
    const [showModal, setShowModal] = useState(false); 
    const [currentHost, setCurrentHost] = useState(0);
    const [isHostChange, setIsHostChange] = useState(false);
    const [newHostId, setNewHostId] = useState(null);
    const [previousScores, setPreviousScores] = useState(null);
    const [showScoreSelection, setShowScoreSelection] = useState(false);
    const [winningUserId, setWinningUserId] = useState(null);
    const [payments, setPayments] = useState([]); 
    const [isRestoreClicked, setIsRestoreClicked] = useState(false);

    useEffect(() => {
        const storedScores = JSON.parse(localStorage.getItem('userScores'));
        if (storedScores) {
            setUsers(storedScores);
        } else if (names && names.length > 0) {
            const initialUsers = names.map((name, index) => ({
                id: index + 1,
                name: name,
                score: 0,
            }));
            setUsers(initialUsers);
        }
    }, [names]);

    /*useEffect(() => {
        if (previousScores && isRestoreClicked) {
            setUsers(previousScores);
            setIsRestoreClicked(false);
        }
    }, [previousScores]);*/
    
    const HandleReplaceUser = () => {
        if (selectedUserId !== null && replacementType === 'replace') {
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === selectedUserId 
                    ? { ...user, name: newUserName, score: resetScore ? 0 : user.score } 
                    : user
                )
            );

            setNewUserName('');
            setSelectedUserId(null);
            setResetScore(false);
            setShowReplacement(false);
        } else if (replacementType === 'swap' && selectedUserId !== null && secondSelectedUserId !== null) {
            setUsers(prevUsers => {
                const firstUser = prevUsers.find(user => user.id === selectedUserId);
                const secondUser = prevUsers.find(user => user.id === secondSelectedUserId);

                return prevUsers.map(user => {
                    if (user.id === selectedUserId) {
                        return { ...user, id: secondUser.id, name: secondUser.name, score: secondUser.score };
                    } else if (user.id === secondSelectedUserId) {
                        return { ...user, id: firstUser.id, name: firstUser.name, score: firstUser.score };
                    }
                    return user;
                });
            });
            setSelectedUserId(null);
            setSecondSelectedUserId(null);
            setShowReplacement(false);
        }
    };
    
    const HandleShowModal = () => setShowModal(true);
    const HandleCloseModal = () => setShowModal(false);
    const HandleConfirmAction = (type) => {
        setReplacementType(type);
        setShowReplacement(true);
    };

    const rounds = ["東", "南", "西", "北"];

    const HandleRoundChangeDraw = () => {
        setCurrentRound(currentWind === 3 ? (currentRound === 3 ? 0 : currentRound + 1) : currentRound);
        setCurrentWind(currentWind === 3 ? 0 : currentWind + 1);
        setCurrentHost(currentHost === 3 ? 0 : currentHost + 1);
    }

    const HandleScoreIncrement = (
        winningId, 
        selectedFan, 
        selectedLoserId, 
        isSelfDraw, 
        selectedSelfDrawFan, 
        isBaoSelfDraw, 
        selectedBaoUserId
    ) => {
        const pointsData = JSON.parse(localStorage.getItem('pointsData')) || {};
        const pointsList = pointsData.pointsList || [];
        const losePointsList = pointsData.losePointsList || [];
        const normalPointsList = pointsData.normalPointsList || [];
        const selfPointsList = pointsData.selfPointsList || [];
        const gameSettings = JSON.parse(localStorage.getItem('gameSetting')) || {};
        const loseValue = parseFloat(gameSettings.lose) || 0;
    
        const winningPoints = pointsList[selectedFan] || 0;
        const losingPoints = losePointsList[selectedFan] || 0;
    
        // Store current scores before updating
        const currentScores = [...users];
        setPreviousScores(currentScores); // Set previous scores for restoration
    
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
                let updatedScore = user.score;
    
                if (isSelfDraw) {
                    if (user.id === winningId) {
                        updatedScore += selfPointsList[selectedSelfDrawFan] || 0; 
                    } 
    
                    if (isBaoSelfDraw && selectedBaoUserId && user.id === selectedBaoUserId) {
                        updatedScore -= selfPointsList[selectedSelfDrawFan] || 0; 
                    } else if (!isBaoSelfDraw && !selectedBaoUserId && (user.id !== winningId)) {
                        const selfDrawPoints = selfPointsList[selectedSelfDrawFan] || 0; 
                        updatedScore -= (selfDrawPoints / 3); 
                    }
                } else {
                    if (user.id === winningId) {
                        updatedScore += winningPoints; 
                    } else if (user.id === selectedLoserId) {
                        updatedScore -= losingPoints; 
                    } else if (loseValue === 0.5) {
                        updatedScore -= (normalPointsList[selectedFan] || 0); 
                    }
                }
                return { ...user, score: updatedScore }; 
            });
    
            // Update local storage after setting the users
            localStorage.setItem('userScores', JSON.stringify(updatedUsers));
            return updatedUsers; // Return the updated users array
        });
    
        // Calculate payments based on updated scores
        // Use the updated state of users directly
        const calculatedPayments = settleScores([...users]); // Pass the most recent users
        //console.log(calculatedPayments); // Log the payments for debugging
        // setPayments(calculatedPayments); // Uncomment to update the state with the calculated payments
    };

    const settleScores = (users) => {
        const balances = users.map(user => ({
            name: user.name,
            balance: user.score
        }));
    
        const creditors = balances.filter(user => user.balance > 0);
        const debtors = balances.filter(user => user.balance < 0);
    
        const transactions = [];
    
        while (creditors.length > 0 && debtors.length > 0) {
            const creditor = creditors[0];
            const debtor = debtors[0];
    
            const settlementAmount = Math.min(creditor.balance, Math.abs(debtor.balance));
    
            transactions.push({
                from: debtor.name,
                to: creditor.name,
                amount: settlementAmount,
            });
    
            creditor.balance -= settlementAmount;
            debtor.balance += settlementAmount;
    
            if (creditor.balance === 0) {
                creditors.shift(); 
            }
            if (debtor.balance === 0) {
                debtors.shift();
            }
        }
    
        return transactions;
    };

    const HandleRestoreScores = () => {
        if (previousScores) {
            setCurrentHost(currentHost > 0 ? (currentHost - 1) : 3);
            setCurrentWind(currentWind > 0 ? (currentWind - 1) : 3);
            setCurrentRound(currentWind < 3 ? currentRound : (currentRound === 0 ? 3 : (currentRound - 1)));
            setUsers(previousScores);
            localStorage.setItem('userScores', JSON.stringify(previousScores)); 
            setPreviousScores(null); 
            setIsRestoreClicked(true); // Set this after updating users
        }
    };
    
    const HandleHostChange = () => {
        setIsHostChange(true);
    }

    const HandleHostChangeConfirm = () => {
        if (newHostId !== null) {
            setCurrentHost(newHostId - 1); 
        }
        setIsHostChange(false);
        setNewHostId(null); 
    };

    const HandleHostChangeCancel = () => {
        setIsHostChange(false);
    }

    const HandleClickEat = (id) => {
        setWinningUserId(id);
        setShowScoreSelection(true); 
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
                return user; // Return the user as is for now
            });
            return updatedUsers;
        });
        /*setCurrentRound(currentWind === 3 ? (currentRound === 3 ? 0 : currentRound + 1) : currentRound);
        setCurrentWind(currentWind === 3 ? 0 : currentWind + 1);
        if((id-1)!=currentHost)
            setCurrentHost(currentHost === 3 ? 0 : currentHost + 1);*/
    };

    const HandleSettleMoney = () => {
        const calculatedPayments = settleScores(users);
        //console.log(calculatedPayments);
        setPayments(calculatedPayments); 
    };

    return (
        <>
            <div className='container'>
                <div className='button-row'>
                    <button className='function' onClick={HandleShowModal}>
                        換人/換位
                    </button>
                    <button className='function' onClick={HandleHostChange}>換莊</button>
                    <button className='function' onClick={HandleRestoreScores}>還原分數</button>
                    <button className='function' onClick={HandleSettleMoney}>找數</button>
                </div>
                <p>{rounds[currentRound]}圈 {rounds[currentWind]}風</p>
                {users.length > 0 ? (
                    <>
                        <div className='row'>
                            {users[2] && (
                                <UserCard 
                                    key={users[2].id}
                                    name={users[2].name}
                                    score={users[2].score}
                                    HandleRoundChange={() => HandleClickEat(users[2].id)} 
                                    isHost={currentHost === (users[2].id - 1)}
                                />
                            )}
                        </div>
                        <div className='row'>
                            {users[3] && (
                                <UserCard 
                                    key={users[3].id}
                                    name={users[3].name}
                                    score={users[3].score}
                                    HandleRoundChange={() => HandleClickEat(users[3].id)} 
                                    isHost={currentHost === (users[3].id - 1)}
                                />
                            )}
                            <button className='draw' onClick={HandleRoundChangeDraw}>流局</button>
                            {users[1] && (
                                <UserCard 
                                    key={users[1].id}
                                    name={users[1].name}
                                    score={users[1].score}
                                    HandleRoundChange={() => HandleClickEat(users[1].id)} 
                                    isHost={currentHost === (users[1].id - 1)}
                                />
                            )}
                        </div>
                        <div className='row'>
                            {users[0] && (
                                <UserCard 
                                    key={users[0].id}
                                    name={users[0].name}
                                    score={users[0].score}
                                    HandleRoundChange={() => HandleClickEat(users[0].id)} 
                                    isHost={currentHost === (users[0].id - 1)}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <p>No users to display</p>
                )}

                <Modal 
                    isOpen={showModal} 
                    onClose={HandleCloseModal} 
                    onConfirm={HandleConfirmAction}
                />

                {showScoreSelection && (
                    <ScoreSelectionModal 
                        users={users}
                        winningUser={winningUserId}
                        onClose={(selectedFan, selectedLoserId, isSelfDraw, selectedSelfDrawFan, isBaoSelfDraw, selectedBaoUserId) => {
                            setShowScoreSelection(false);
                            HandleScoreIncrement(winningUserId, selectedFan, selectedLoserId, isSelfDraw, selectedSelfDrawFan, isBaoSelfDraw, selectedBaoUserId);
                        }}
                        setCurrentRound={setCurrentRound}
                        setCurrentWind={setCurrentWind}
                        setCurrentHost={setCurrentHost}
                        currentRound={currentRound}
                        currentWind={currentWind}
                        currentHost={currentHost}
                    />
                )}

                {showReplacement && (
                    <UserReplacement 
                        users={users}
                        replacementType={replacementType}
                        setReplacementType={setReplacementType}
                        newUserName={newUserName}
                        setNewUserName={setNewUserName}
                        selectedUserId={selectedUserId}
                        setSelectedUserId={setSelectedUserId}
                        secondSelectedUserId={secondSelectedUserId}
                        setSecondSelectedUserId={setSecondSelectedUserId}
                        resetScore={resetScore}
                        setResetScore={setResetScore}
                        handleReplaceUser={HandleReplaceUser}
                        showReplacement={showReplacement}
                        setShowReplacement={setShowReplacement}
                    />
                )}

                {isHostChange && (
                    <>
                    <div>
                        <label htmlFor="host">要轉邊個做莊?</label><br />
                        {users.map(user => (
                            <div key={user.id}>
                                <input 
                                    type="radio" 
                                    name="host" 
                                    value={user.id} 
                                    checked={newHostId === user.id} 
                                    onChange={(e) => setNewHostId(Number(e.target.value))}
                                    disabled={currentHost === (user.id - 1)} 
                                />
                                {user.name}
                            </div>
                        ))}
                        <button onClick={HandleHostChangeConfirm}>確定</button>
                        <button onClick={HandleHostChangeCancel}>撳錯</button>
                    </div>
                    </>
                )}

                {payments.length > 0 && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={() => setPayments([])}>
                                &times;
                            </button>
                            <h2>找數</h2>
                            <ul>
                                {payments.map((transaction, index) => (
                                    <li key={index}>
                                        {transaction.from}找${transaction.amount.toFixed(2)}俾{transaction.to}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default MainPage;