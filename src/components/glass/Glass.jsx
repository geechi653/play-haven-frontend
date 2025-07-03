import "./Glass.css";

function Glass({ children, type }) {
  return (
    <div className={`${type} glass-card col-sm-7 col-md-6 col-lg-6 p-4`}>
      {children}
    </div>
  );
}

export default Glass;
