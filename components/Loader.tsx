

interface LoaderProps {
    color?: string;
    size?: "sm" | "md" | "lg";
}

export default function Loader({ color = "bg-white", size = "md" }: LoaderProps) {
    const sizeClasses = {
        sm: { circle: "w-1.5 h-1.5", gap: "gap-0.5" },
        md: { circle: "w-3 h-3", gap: "gap-1" },
        lg: { circle: "w-4 h-4", gap: "gap-1.5" }
    }

    const { circle, gap } = sizeClasses[size];

    return (
        <div className="flex justify-center items-center" >
            <div className={`flex ${gap}`} >
                <div className={`${circle} ${color} rounded-full animate-bounce `} />
                <div className={`${circle} ${color} rounded-full animate-bounce [animation-delay:100ms] `} />
                <div className={`${circle} ${color} rounded-full animate-bounce [animation-delay:200ms] `} />
           </div>
        </div>
    )
}