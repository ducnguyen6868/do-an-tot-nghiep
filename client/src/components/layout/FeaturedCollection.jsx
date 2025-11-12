import { useState, useEffect } from 'react';
import collectionApi from '../../api/collectionApi';

export default function FeaturedCollection() {
    const [featuredCollections, setFeaturedCollections] = useState([]);
    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await collectionApi.getCollections();
                setFeaturedCollections(response.collections);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        getCollections();
    }, []);

    return (
        <>
            {/* SIDEBAR COLLECTIONS */}
            <section className="relative bg-teal-500 py-2 px-8 transition-colors duration-500 ">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {featuredCollections.map((collection, idx) => (
                        <div
                            key={collection._id}
                            data-animate
                            className="group cursor-pointer animate-cardSlideInUp"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="relative overflow-hidden aspect-[4/3] bg-white shadow-sm"
                                style={{
                                    transform: 'skewX(-10deg)',
                                    transition: 'transform 0.6s ease',
                                    transformOrigin: 'center center'
                                }}
                            >
                                <img
                                    src={`http://localhost:5000${collection.thumbnail}`}
                                    alt="Collection"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://placehold.co/400x300/334155/ffffff?text=Collection";
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                   
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col text-white items-center justify-center bg-black bg-opacity-30">
                    <h1 className="text-5xl font-bold mb-2">YOUR TIME. YOUR VIBE.</h1>
                    <p className="text-3xl mb-6">#RuleTheMoment</p>
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                        EXPLORE NEW DROPS
                    </button>
                </div>
            </section>
        </>
    )
}