import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, fetchPost } from '../api/postApi';

function formatDateTime(iso) {
  return iso ? iso.slice(0, 16).replace('T', ' ') : '';
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchPost(id)
      .then((res) => {
        if (!ignore) {
          setPost(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('이 게시글을 삭제할까요?')) return;
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;

  if (error) {
    return (
      <div>
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        <Link to="/" className="text-sm text-violet-600 hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-b border-gray-100 pb-4 text-sm text-gray-400">
        <span>작성자 {post.authorNickname}</span>
        <span>작성일 {formatDateTime(post.createdAt)}</span>
        {post.updatedAt !== post.createdAt && (
          <span>수정일 {formatDateTime(post.updatedAt)}</span>
        )}
        <span>조회 {post.viewCount}</span>
      </div>

      <div className="min-h-40 whitespace-pre-wrap py-6 text-gray-700">{post.content}</div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <Link
          to="/"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          목록
        </Link>
        {post.mine && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/posts/${post.id}/edit`)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
