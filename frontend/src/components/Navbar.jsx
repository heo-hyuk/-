import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-gray-800">
          📢 공지 게시판
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="text-gray-500">{user.nickname}님</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-3 py-1 text-gray-600 transition hover:bg-gray-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-violet-600 px-3 py-1 text-white transition hover:bg-violet-700"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
