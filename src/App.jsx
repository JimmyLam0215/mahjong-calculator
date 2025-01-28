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
                <Route path="/" element={<Home />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/points-table" element={<PointsTable />} />
                <Route path="/main-page" element={<MainPage />} />
                <Route path="/set-names" element={<PromptNames />}/>
            </Routes>
            <Footer />
        </Router>
    </>
  )
}

export default App
