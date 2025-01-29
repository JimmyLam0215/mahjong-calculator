import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import PointsTable from './PointsTable';

function Setting() {
    const [selectedOption, setSelectedOption] = useState('');
    const [lose, setLose] = useState('1');
    const [point, setPoint] = useState('1');
    const [numberInput, setNumberInput] = useState('0');
    const [minValue, setMinValue] = useState(3);
    const [maxValue, setMaxValue] = useState(10);
    const [isVisible, setIsVisible] = useState(false);
    const [fourPointAbove, setFourPointAbove] = useState('0.5');
    //const [self, setSelf] = useState(2);
    const [showPromptNames, setShowPromptNames] = useState(false); 
    const [hasViewedCalculation, setHasViewedCalculation] = useState(false); // New state variable
    const navigate = useNavigate();

    const data = {
        "lose": lose,
        "point": point,
        "custom": numberInput,
        "min": minValue,
        "max": maxValue,
        "fourPointAbove": fourPointAbove,
        //"self": self
    };

    const HandleOptionChange = (event) => {
        setSelectedOption(event.target.value); 
        setPoint(event.target.value);
    };

    const HandleMinMaxValueChange = (event) => {
        setMinValue(Math.round(event[0]));
        setMaxValue(Math.round(event[1]));
    }

    const HandleLoseChange = (event) => {
        setLose(event.target.value);
    }

    const HandleFourPointAboveChange = (event) => {
        setFourPointAbove(event.target.value);
    }

    const Slider = () => (
        <Nouislider
            range={{ min: [0, 1], max: 13 }} start={[3, 10]}
            connect onChange={HandleMinMaxValueChange} />
    );

    const ChangeVisibility = () => {
        setIsVisible((prev) => !prev);
        setHasViewedCalculation(true); // Set to true when the user views the calculation
    };

    const HandleNumberInputChange = (event) => {
        setNumberInput(event.target.value);
    };

    /*const HandleSelfNumberChange = (event) => {
        setSelf(event.target.value);
    }*/

    const HandleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        navigate("/mahjong-calculator/set-names");
    }

    const HandleSetting = () => {
        localStorage.setItem('gameSetting', JSON.stringify(data));
    }

    return (
        <>        
        <div className="setting">
            <form onSubmit={HandleSubmit}> {/* Attach HandleSubmit to form */}
                <fieldset>
                    <legend><h2>玩法設定</h2></legend>
                    <label htmlFor="lose"><h3>銃制</h3></label> 
                    <input type="radio" name="lose" id="lose-whole" value={'1'} defaultChecked onChange={HandleLoseChange}/>全銃 
                    <input type="radio" name="lose" id="lose-half" value={'0.5'} onChange={HandleLoseChange}/>半銃 <br />
                    <label htmlFor="point"><h3>籌碼計法</h3></label>
                    <input type="radio" name="point" id="point-0.25"  value={'0.25'} onChange={HandleOptionChange}/>二五雞
                    <input type="radio" name="point" id="point-0.5"  value={'0.5'} onChange={HandleOptionChange}/>五一
                    <input type="radio" name="point" id="point-1"  value={'1'} onChange={HandleOptionChange} defaultChecked/>一二蚊
                    <input type="radio" name="point" id="point-custom"  value={'2'} onChange={HandleOptionChange}/>自己set <br />
                    {selectedOption === '2' && (
                        <>
                        <label htmlFor='custom' className="custom">一番幾錢?</label><br />
                        <input type="number" id="custom" value={numberInput} onChange={HandleNumberInputChange} />
                        </>
                    )}
                    <label htmlFor="4-points-above"><h3>四番以上</h3></label>
                    <input type="radio" name='4-points-above' value={'1'} onChange={HandleFourPointAboveChange}/>辣辣上
                    <input type="radio" name='4-points-above' value={'0.5'} onChange={HandleFourPointAboveChange} defaultChecked/>半辣上
                    <label htmlFor="point-cal"><h3>番數設定</h3></label>
                    <div className="slider">{Slider()}</div>
                    <span>{minValue}番起糊</span>
                    <span>{maxValue}番滿糊</span><br />
                    {/*<label htmlFor="self">自摸分數</label> <br />
                    <input type="float" name="self" id="self" defaultValue={2} onChange={HandleSelfNumberChange}/>倍*/}
                    <div>
                        <button type="button" onClick={ChangeVisibility}>
                            {isVisible ? "收起" : "查看番數計算"}
                        </button>
                        {isVisible && <PointsTable message={data} />}
                    </div>
                </fieldset>
                <button type="submit" onClick={HandleSetting} disabled={!hasViewedCalculation}>確定</button> {/* Disable if not viewed */}
            </form>
        </div>
        </>
    );
}

export default Setting;