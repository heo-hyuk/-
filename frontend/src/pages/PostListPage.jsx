import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPosts } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 10;

function formatDate(iso) {
  return iso ? iso.slice(0, 10) : '';
}

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const page = Number(searchParams.get('page') ?? 0);
  const searchType = searchParams.get('searchType') ?? 'all';
  const keyword = searchParams.get('keyword') ?? '';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchPosts({ page, size: PAGE_SIZE, searchType, keyword })
      .then((res) => {
        if (!ignore) {
          setData(res);
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
  }, [page, searchType, keyword]);

  const handleSearch = ({ searchType: type, keyword: kw }) => {
    const next = { page: '0' };
    if (kw.trim()) {
      next.searchType = type;
      next.keyword = kw.trim();
    }
    setSearchParams(next);
  };

  const handlePageChange = (nextPage) => {
    const next = { page: String(nextPage) };
    if (keyword) {
      next.searchType = searchType;
      next.keyword = keyword;
    }
    setSearchParams(next);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">공지사항</h1>
        {isAuthenticated && (
          <button
            onClick={() => navigate('/posts/new')}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            글쓰기
          </button>
        )}
      </div>

      <div className="mb-4">
        <SearchBar initialType={searchType} initialKeyword={keyword} onSearch={handleSearch} />
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="w-16 px-3 py-2 text-center font-medium">번호</th>
              <th className="px-3 py-2 text-left font-medium">제목</th>
              <th className="w-24 px-3 py-2 text-center font-medium">작성자</th>
              <th className="w-28 px-3 py-2 text-center font-medium">작성일</th>
              <th className="w-16 px-3 py-2 text-center font-medium">조회</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : data && data.content.length > 0 ? (
              data.content.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-center text-gray-400">{post.id}</td>
                  <td className="px-3 py-2">
                    <Link to={`/posts/${post.id}`} className="text-gray-800 hover:text-violet-600">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-500">{post.authorNickname}</td>
                  <td className="px-3 py-2 text-center text-gray-400">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-400">{post.viewCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}
