export default function UserList({ users, active, onSelect }) {
  return (
    <div className="user-list">
      {users.map(u => (
        <button
          key={u._id}
          className={`user-item ${active===u._id ? 'active' : ''}`}
          onClick={() => onSelect(u._id)}
        >
          <div className="avatar">{(u.name || u.email || 'U')[0].toUpperCase()}</div>
          <div className="meta">
            <div className="name">{u.name || u.email}</div>
          </div>
        </button>
      ))}
    </div>
  );
}