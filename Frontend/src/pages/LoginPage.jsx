
import Login from "../components/Login";

const LoginPage = ({ role,setUser }) => {


  return (

        <Login role={role} setUser={setUser} />
 
  );
};

export default LoginPage;
