export default function PanelLoader({
  title = 'Loading...',
  subtitle = '',
  icon = null,
}) {
  return (
    <div className="admin-panel-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="admin-panel-loading-card">
        {icon ? <div className="admin-panel-loading-icon">{icon}</div> : null}
        <span className="admin-panel-loading-spinner" aria-hidden="true" />
        <h3 className="admin-panel-loading-title">{title}</h3>
        {subtitle ? <p className="admin-panel-loading-subtitle">{subtitle}</p> : null}
      </div>
    </div>
  );
}
