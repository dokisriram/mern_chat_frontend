import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';

export default function ChatWindow({ meId, partner, messages, onSend }) {
  const [text, setText] = useState('');
  const scrollerRef = useRef(null);

  useEffect(() => {
    // scroll to bottom on new messages
    scrollerRef.current?.scrollTo(0, scrollerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="avatar">{(partner?.name || partner?.email || 'U')[0].toUpperCase()}</div>
        <div>
          <div className="name">{partner?.name || partner?.email}</div>
          <div className="status">Direct message</div>
        </div>
      </header>

      <div ref={scrollerRef} className="messages">
        {messages.map(m => (
          <Message key={m._id} me={m.sender === meId} message={m} />
        ))}
      </div>

      <MessageInput
        value={text}
        onChange={setText}
        onSend={() => { onSend(text); setText(''); }}
      />
    </div>
  );
}