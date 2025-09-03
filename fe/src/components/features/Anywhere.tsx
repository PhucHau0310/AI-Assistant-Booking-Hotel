import Image from "next/image";

const Anywhere = () => {
    const features = [
        {
            id: 1,
            title: "Toàn bộ nhà",
            image: "https://booking-api.hau.io.vn/images/anywhere/fullHouseNew.png",
            description: "Relax in an enchanting ambience",
        },
        {
            id: 2,
            title: "Chỗ ở độc đáo",
            image: "https://booking-api.hau.io.vn/images/anywhere/houseSpecial.png",
            description:
                "Samira Hadid ★★★★★ The stunning views from the spacious deck... alongside exceptional service and memorable food.",
        },
        {
            id: 3,
            title: "Trang trại và thiên nhiên",
            image: "https://booking-api.hau.io.vn/images/anywhere/housefarm.png",
            description: "Farm and nature at the hotel",
        },
        {
            id: 4,
            title: "Cho phép mang theo thú cưng",
            image: "https://booking-api.hau.io.vn/images/anywhere/housePet.png",
            description: "PETS ALLOWED AT THE HOTEL",
        },
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Anywhere
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover unique accommodation types that suit all your
                        needs
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.id} className="group cursor-pointer">
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3] bg-gray-200 dark:bg-gray-800">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg text-center font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Anywhere;
