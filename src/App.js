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
import './styles/Common.css';

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
        return <DanChuPage onChange={setTab} />;
      case 'sosanh':
        return <SoSanhPage onChange={setTab} />;
      case 'banchat':
        return <BanChatPage onChange={setTab} />;
      case 'nhanuoc':
        return <NhaNuocPage onChange={setTab} />;
      case 'moiquanhe':
        return <MoiQuanHePage onChange={setTab} />;
      case 'vietnam':
        return <VietNamPage onChange={setTab} />;
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
