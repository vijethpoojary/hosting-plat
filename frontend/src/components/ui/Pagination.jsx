export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) arr.push(i);
    return arr;
  };

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
      {page > 3 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          <span style={{ padding: '0 4px', alignSelf: 'center', color: 'var(--text-light)' }}>…</span>
        </>
      )}
      {getPages().map((p) => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      {page < pages - 2 && (
        <>
          <span style={{ padding: '0 4px', alignSelf: 'center', color: 'var(--text-light)' }}>…</span>
          <button className="page-btn" onClick={() => onPageChange(pages)}>{pages}</button>
        </>
      )}
      <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page === pages}>›</button>
    </div>
  );
}
