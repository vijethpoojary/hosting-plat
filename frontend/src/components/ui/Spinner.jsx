export default function Spinner({ fullPage = false }) {
  return (
    <div className="loading-center" style={fullPage ? { minHeight: '60vh' } : {}}>
      <div className="spinner" />
    </div>
  );
}
