import "./Glass.css";

function Glass({ children, type }) {
  return (
    <div className={`${type} glass-card col-8 col-md-6 col-lg-4 p-3`}>
      {children}
    </div>
  );
}

export default Glass;
