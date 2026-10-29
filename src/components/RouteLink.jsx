export default function RouteLink({ href, onNavigate, children, ...rest }) {
  function onClick(event) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.currentTarget.target && event.currentTarget.target !== "_self") return;
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  }

  return (
    <a {...rest} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
