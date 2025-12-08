import { useState } from 'react';
import Header from './components/Header';
import LessonPage from './components/LessonPage';
import FlashcardPage from './components/FlashcardPage';
import GamePage from './components/GamePage';
import ChatPage from './components/ChatPage';
import './App.css';

function App() {
  const [tab, setTab] = useState('lesson');

  return (
    <div className="app-shell">
      <Header active={tab} onChange={setTab} />
      <main className="content">
        {tab === 'lesson' && <LessonPage />}
        {tab === 'flashcard' && <FlashcardPage />}
        {tab === 'game' && <GamePage />}
        {tab === 'chat' && <ChatPage />}
      </main>
    </div>
  );
}

export default App;
