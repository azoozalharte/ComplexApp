export default function Container({ children, wide }) {
  return (
    <div className={`container ${wide ? "" : "container--narrow"} py-md-5`}>
      {children}
    </div>
  );
}
