"use client";

import error404 from "../../public/animations/NotFound.json";
import Link from "next/link";
import LottieAnimation from "@/components/features/LottieAnimation";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <div className="max-w-md text-center flex flex-col items-center justify-center">
                <div className="w-64 h-64 mb-6">
                    <LottieAnimation
                        animationData={error404}
                        loop={true}
                        className="w-full h-full"
                    />
                </div>

                <div>
                    <h1 className="text-5xl text-center font-extrabold text-[#FE6B6E] mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-semibold mb-2">Not Found</h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Sorry, we couldn't find the page you requested. The URL
                        may have changed or the page may have been deleted.
                    </p>

                    <Link
                        href="/"
                        className="inline-block px-6 py-3 font-medium rounded-lg shadow-md transition duration-300 bg-[#FE6B6E] text-white hover:bg-[#e05a5c] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
