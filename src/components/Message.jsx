import { format } from 'date-fns';

export default function Message({ me, message }) {
  const time = message.createdAt ? format(new Date(message.createdAt), 'p') : '';
  return (
    <div className={`msg-row ${me ? 'me' : 'them'}`}>
      <div className="bubble">
        <div className="text">{message.message}</div>
        <div className="meta">{time}</div>
      </div>
    </div>
  );
}