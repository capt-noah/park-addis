
export default function Loader() {
    return (
        <div className="w-full h-full flex justify-center items-center text-2xl text-white" >
            <div className="flex gap-1" >
                <div className="w-4 h-4 bg-white rounded-full animate-bounce " />
                <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:100ms] " />
                <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:200ms] " />
           </div>
        </div>
    )
}