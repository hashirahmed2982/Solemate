import firebase from "firebase";
import { useNavigate } from "react-router-dom";



function Homepage(){
    let navigate = useNavigate()

    const Signout = (event) =>{
        firebase.auth().signOut().then(()=>{
            if(firebase.auth().currentUser == null){
                let path = '/'; 
                      navigate(path);
         
         }

        });
    }

   return(
    <><div className="container-login100-form-btn">
           <button className="login100-form-btn" type="submit" onClick={Signout}>Signout</button>
       </div><div className="container-login100-form-btn">
               <button className="login100-form-btn" type="submit" onClick={Signout}>Signout</button>
           </div><div className="container-login100-form-btn">
               <button className="login100-form-btn" type="submit" onClick={Signout}>Signout</button>
           </div><div className="container-login100-form-btn">
               <button className="login100-form-btn" type="submit" onClick={Signout}>Signout</button>
           </div></>
   )
}
export default Homepage;