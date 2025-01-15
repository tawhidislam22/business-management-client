import { useForm } from "react-hook-form";
import SocialLogin from "../../Coponents/SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";


const LogIn = () => {
    const {signIn}=useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        signIn(data.email,data.password)
        .then(res=>{
            console.log(res.data);
        })
        .catch(err=>{
            console.log(err.message)
        })
    }
    return (
        <div className="max-w-6xl mx-auto">
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input {...register("email", { required: true })} type="email" placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input {...register("email", { required: true })} type="password" placeholder="Password" className="input input-bordered" required />
                            </div>

                            

                            <input type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;