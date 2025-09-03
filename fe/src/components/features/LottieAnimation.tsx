"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
    animationData: any;
    loop?: boolean;
    className?: string;
}

const LottieAnimation = ({
    animationData,
    loop = true,
    className,
}: LottieAnimationProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div
                className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center`}
            >
                <div className="text-6xl text-gray-400">404</div>
            </div>
        );
    }

    return (
        <Lottie
            animationData={animationData}
            loop={loop}
            className={className}
        />
    );
};

export default LottieAnimation;
