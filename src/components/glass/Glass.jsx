import "./Glass.css";

function Glass({ children, type }) {
  return (
    <div className={`${type} glass-card col-sm-12 col-md-9 col-lg-5 py-4`}>
      {children}
    </div>
  );
}

export default Glass;
