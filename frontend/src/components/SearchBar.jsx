import { useState } from 'react';

const SEARCH_TYPES = [
  { value: 'all', label: '전체' },
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'author', label: '작성자' },
];

/** props: initialType, initialKeyword, onSearch({ searchType, keyword }) */
export default function SearchBar({ initialType = 'all', initialKeyword = '', onSearch }) {
  const [searchType, setSearchType] = useState(initialType);
  const [keyword, setKeyword] = useState(initialKeyword);

  const submit = (e) => {
    e.preventDefault();
    onSearch({ searchType, keyword });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-600"
      >
        {SEARCH_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
      >
        검색
      </button>
    </form>
  );
}
