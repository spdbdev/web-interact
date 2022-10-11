import './TopBar.css';
import logo from './tempLogo.png';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { logout } from "@jumbo/services/auth/firebase/firebase";
function TopBar() {
  return (
    <div className="TopBar">
        <div>
            <a>Start a campaign</a>
        </div>
        <div style={{height:'100%'}}>
            <img src={logo} alt="logo" style={{height:'100%'}}/>
        </div>
        <div style={{flexDirection:'row', display:'flex', width:100, justifyContent:'space-between'}}>
          <div>
            <a>Search</a>
          </div>
          <div>
            <Link to="/"><Button onClick={logout}>Logout</Button></Link>
          </div>

          
        </div>
    </div>
  );
}

export default TopBar;
