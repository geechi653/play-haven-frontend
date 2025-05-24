import Logo from '../../components/Logo';
import { Link } from 'react-router';

function About() {
  return (
    <>
      <h1 className="text-center mt-5 text-body-secondary fw-bold">
        Uh, I guess you dont have anything to show yet on Home Page?
      </h1>
      <Logo />
      <div className="text-center">
        <NavButton to="/home" text={'> Home'} />
        <NavButton to="/demo" text="> Demo" />
      </div>
    </>
  );
}

export default About;
