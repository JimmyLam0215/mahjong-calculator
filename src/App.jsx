import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import HomeButton from './HomeButton';
import Setting from './Setting';
import Credits from './Credits';
import Footer from './Footer';
import PointsTable from './PointsTable';
import MainPage from './MainPage';
import PromptNames from './PromptNames';
import './App.css'

function App() {

  return (
    <>
      <div className="background"></div>
       <Router>
            <HomeButton />
            <Routes>
                <Route path="/mahjong-calculator" element={<Home />} />
                <Route path="/mahjong-calculator/setting" element={<Setting />} />
                <Route path="/mahjong-calculator/credits" element={<Credits />} />
                <Route path="/mahjong-calculator/points-table" element={<PointsTable />} />
                <Route path="/mahjong-calculator/main-page" element={<MainPage />} />
                <Route path="/mahjong-calculator/set-names" element={<PromptNames />}/>
            </Routes>
            <Footer />
        </Router>
    </>
  )
}

export default App
