/**
 * 0-based page 번호로 동작하는 페이지네이션.
 * props: page(현재), totalPages, onChange(nextPage)
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const blockSize = 5;
  const blockStart = Math.floor(page / blockSize) * blockSize;
  const blockEnd = Math.min(blockStart + blockSize, totalPages);
  const pages = [];
  for (let i = blockStart; i < blockEnd; i++) pages.push(i);

  const btn =
    'min-w-8 rounded-md border px-2 py-1 text-sm transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <button
        className={`${btn} border-gray-300 text-gray-600 hover:bg-gray-100`}
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
      >
        이전
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`${btn} ${
            p === page
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        className={`${btn} border-gray-300 text-gray-600 hover:bg-gray-100`}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
}
