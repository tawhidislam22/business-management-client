import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure"


const useHr = () => {
    const {user}=useAuth()
    const axiosSecure=useAxiosSecure()
    const {data:isHr,isPending:isHrLoading}=useQuery({
        queryKey:[user?.email,'isHr'],
        queryFn:async()=>{
            const res=await axiosSecure.get(`/users/hr/${user.email}`)
            return res.data?.hr
        }
    })
    return [isHr,isHrLoading]
};

export default useHr;