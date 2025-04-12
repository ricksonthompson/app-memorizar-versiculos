import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyVerses from './pages/MyVerses';
import CustomLists from './pages/CustomLists';
import ReciteVerses from './pages/ReciteVerses';
import './styles/tailwind.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/meus-versiculos" element={<MyVerses />} /> */}
            <Route path="/listas-personalizadas" element={<CustomLists />} />
            {/* <Route path="/recitar-versiculos" element={<ReciteVerses />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;