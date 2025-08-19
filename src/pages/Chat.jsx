import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import UserList from '../components/UserList';
import ChatWindow from '../components/chatWindow';

export default function Chat() {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null); // selected user (_id)
  const [threads, setThreads] = useState({}); // { userId: Message[] }

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/user/users');
      console.log(data)
      const list = (data.users || data || []).filter(u => u._id !== user?._id);
      setUsers(list);
    })();
  }, [user?._id]);

  useEffect(() => {
    if (!active) return;
    (async () => {
      try {
        const { data } = await api.get(`user/chats/${active}`); 
        setThreads(prev => ({ ...prev, [active]: data.messages || [] }));
      } catch {
        
      }
    })();
  }, [active]);

  // receive incoming messages
  useEffect(() => {
    if (!socket) return;
    const onMsg = (msg) => {
      const other = msg.sender === user._id ? msg.receiver : msg.sender;
      setThreads(prev => ({
        ...prev,
        [other]: [...(prev[other] || []), msg],
      }));
    };
    socket.on('chat-message', onMsg);
    return () => socket.off('chat-message', onMsg);
  }, [socket, user?._id]);

  const activeThread = useMemo(() => threads[active] || [], [threads, active]);

  const sendMessage = (text) => {
    if (!socket || !active || !text.trim()) return;
    socket.emit('chat-message', { message: text, receiver: active });
    // const fake = {
    //   _id: crypto.randomUUID(),
    //   message: text,
    //   sender: user._id,
    //   receiver: active,
    //   createdAt: new Date().toISOString(),
    //   };
    // setThreads(prev => ({ ...prev, [active]: [...(prev[active] || []), fake] }));
  };


  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="me">
          <div className="me-name">{user?.name}</div>
          <button onClick={logout}>Logout</button>
        </div>
        <UserList users={users} active={active} onSelect={(id)=>setActive(id)} />
      </aside>
      <main className="main">
        {active ? (
          <ChatWindow
            meId={user._id}
            partner={users.find(u=>u._id===active)}
            messages={activeThread}
            onSend={sendMessage}
          />
        ) : (
          <div className="empty">Select a user to start chatting</div>
        )}
      </main>
    </div>
  );
}