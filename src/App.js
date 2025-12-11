import { useState } from 'react';
import Header from './components/Header';
import LessonPage from './components/LessonPage';
import FlashcardPage from './components/FlashcardPage';
import GamePage from './components/GamePage';
import ChatWidget from './components/ChatWidget';
// New page imports
import DanChuPage from './pages/DanChuPage';
import SoSanhPage from './pages/SoSanhPage';
import BanChatPage from './pages/BanChatPage';
import NhaNuocPage from './pages/NhaNuocPage';
import MoiQuanHePage from './pages/MoiQuanHePage';
import VietNamPage from './pages/VietNamPage';
import './App.css';

function App() {
  const [tab, setTab] = useState('lesson');

  const renderPage = () => {
    switch (tab) {
      case 'lesson':
        return <LessonPage onChange={setTab} />;
      case 'flashcard':
        return <FlashcardPage />;
      case 'game':
        return <GamePage />;
      case 'danchu':
        return <DanChuPage />;
      case 'sosanh':
        return <SoSanhPage />;
      case 'banchat':
        return <BanChatPage />;
      case 'nhanuoc':
        return <NhaNuocPage />;
      case 'moiquanhe':
        return <MoiQuanHePage />;
      case 'vietnam':
        return <VietNamPage />;
      default:
        return <LessonPage onChange={setTab} />;
    }
  };

  return (
    <div className="app-shell">
      <Header active={tab} onChange={setTab} />
      <main>
        {renderPage()}
      </main>
      <ChatWidget />
    </div>
  );
}

export default App;
