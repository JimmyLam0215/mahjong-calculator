import React, { useEffect } from 'react';

function PointsTable({ message }) {
    console.log(message);
    const min = parseInt(message.min);
    const max = parseInt(message.max);
    const point = message.point;
    const lose = message.lose;
    const fourPointAbove = message.fourPointAbove;
    const custom = message.custom;
    // const self = message.self;
    const isFull = (lose === "1");
    const isCustom = (point === "2");
    const isDobule = (fourPointAbove === "1");

    // const pointsList = [isCustom ? isFull ? parseFloat(custom) * 2 : parseFloat(custom) / 2 : isFull ? parseFloat(point) * 4 : parseFloat(point)]
    const pointsList = [isCustom ? parseInt(custom) * 2 * 4 : parseFloat(point) * 4];
    const selfPointsList = [];
    const normalPointsList = [];
    const losePointsList = [];
    
    for (let i = 1; i <= 4; i++) {
        pointsList[i] = pointsList[i - 1] * 2;
    }
    if (isDobule) {
        for (let i = 5; i < 14; i++) {
            pointsList[i] = pointsList[i - 1] * 2;
        }
    } else {
        for (let i = 5; i < 14; i++) {
            if (i % 2 === 0)
                pointsList[i] = pointsList[i - 2] * 2;
            else
                pointsList[i] = pointsList[i - 1] * 1.5;
        }
    }

    for (let i = 0; i < 14; i++) {
        selfPointsList[i] = (pointsList[i] / 4) * 2 * 3;
        if (isFull) {
            normalPointsList[i] = pointsList[i] / 4;
            losePointsList[i] = pointsList[i];
        } else {
            normalPointsList[i] = pointsList[i] / 4;
            losePointsList[i] = normalPointsList[i] * 2;
        }
    }

    useEffect(() => {
        let dataToStore = {};
        isFull?
        dataToStore = {
            pointsList,
            selfPointsList,
            losePointsList,
        }:dataToStore = {
            pointsList,
            selfPointsList,
            normalPointsList,
            losePointsList,
        };

        localStorage.setItem('pointsData', JSON.stringify(dataToStore));
    }, [pointsList, selfPointsList, normalPointsList, losePointsList]);

    return (
        <>
            <table className="point-table">
                {isFull ? (
                    <tr>
                        <th className="point-table-row">番數</th>
                        <th className="point-table-row">自摸</th>
                        <th className="point-table-row">食糊</th>
                        <th className="point-table-row">出銃</th>
                    </tr>
                ) : (
                    <tr>
                        <th className="point-table-row">番數</th>
                        <th className="point-table-row">自摸</th>
                        <th className="point-table-row">食糊</th>
                        <th className="point-table-row">閒家</th>
                        <th className="point-table-row">出銃</th>
                    </tr>
                )}

                {Array.from({ length: max - min + 1 }, (_, index) => (
                    isFull ? (
                        <tr key={index + min}>
                            <td className="point-table-row">{index + min}番</td>
                            <td className="point-table-row">{selfPointsList[index + min]}</td>
                            <td className="point-table-row">{pointsList[index + min]}</td>
                            <td className="point-table-row">{losePointsList[index + min]}</td>
                        </tr>
                    ) : (
                        <tr key={index + min}>
                            <td className="point-table-row">{index + min}番</td>
                            <td className="point-table-row">{selfPointsList[index + min]}</td>
                            <td className="point-table-row">{pointsList[index + min]}</td>
                            <td className="point-table-row">{normalPointsList[index + min]}</td>
                            <td className="point-table-row">{losePointsList[index + min]}</td>
                        </tr>
                    )
                ))}
            </table>
        </>
    );
}

export default PointsTable;