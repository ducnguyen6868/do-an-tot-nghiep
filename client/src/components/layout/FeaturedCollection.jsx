import { useState, useEffect } from 'react';
import collectionApi from '../../api/collectionApi';

export default function FeaturedCollection() {
    const [featuredCollections , setFeaturedCollections] = useState([]);
    useEffect(()=>{
        const getCollections=async()=>{
            try{
                const response = await collectionApi.getCollections();
                setFeaturedCollections(response.collections);
            }catch(err){
                console.log(err.response?.data?.message||err.message);
            }
        }
        getCollections();
    },[]);
    
    return (
        <>
            {/* Featured Collections */}
            <section className="bg-bg-secondary py-6 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    <div
                        id="featured-header"
                        data-animate
                        className={`text-center mb-10 animate-fadeInUp visible`}
                    >
                        <h2 className="text-3xl font-bold mb-2 text-text-primary">Featured Collections</h2>
                        <p className="text-text-secondary text-sm">Explore our curated collections, each designed to capture a unique spirit.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredCollections.map((collection, idx) => (
                            <div
                                key={collection._id}
                                data-animate
                                className={`group cursor-pointer rounded-lg hover:shadow-xl transition-all animate-cardSlideInUp visible`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div
                                    className="relative overflow-hidden rounded-lg aspect-[4/3] bg-bg-primary shadow-sm"
                                >
                                    <img
                                        src={`http://localhost:5000${collection.thumbnail}`}
                                        alt="Collection"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/334155/ffffff?text=Collection'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center flex-col justify-center px-4">
                                        <p className='text-white text-center font-normal text-base opacity-0 group-hover:opacity-100 transition-opacity'>{collection?.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}