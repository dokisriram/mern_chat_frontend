export default function MessageInput({ value, onChange, onSend }) {
  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <div className="composer">
      <textarea
        placeholder="Type a message"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        onKeyDown={onKey}
        rows={2}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
}