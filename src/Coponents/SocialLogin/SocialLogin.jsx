import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";


const SocialLogin = () => {
    const {googleSignIn}=useAuth()
    const location=useLocation();
    const navigate=useNavigate()
    const from=location.state || '/'
    const handleSignInGoogle=()=>{
        googleSignIn()
        .then(res=>{
            Swal.fire({
                    
                icon: "success",
                title: "User login successfully",
                showConfirmButton: false,
                timer: 1500
            });
            navigate(from)
        })
        .catch(err=>{
            console.log(err.message)
        })
    }

    return (
        <div>
            <div className="btn flex gap-6">
             {/* <img className="w-10" src={googleIcon} alt="" />    */}
            <button className="text-xl font-semibold" onClick={handleSignInGoogle}>Sign in Google</button>
            </div>
        </div>
    );
};

export default SocialLogin;