import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import '../../styles/Brand.css';
import brandApi from '../../api/brandApi';

export default function Brand() {
    const [flippedIndex, setFlippedIndex] = useState(0);
    const [brands, setBrands] = useState([]);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Get Brand 
    useEffect(() => {
        const getBrands = async () => {
            try {
                const response = await brandApi.brand();
                setBrands(response.brand);
            } catch (err) {
                toast.error(err.response?.data?.message || err.response);
            }
        }
        getBrands();
    }, []);

    // Typing effect for description
    useEffect(() => {
        const selectedBrand = flippedIndex !== null ? brands[flippedIndex] : null;
        
        if (!selectedBrand) {
            setDisplayedText('');
            setIsTyping(false);
            return;
        }

        const fullDescription = selectedBrand.description;
        
        if (displayedText.length === fullDescription.length) {
            setIsTyping(false);
            return;
        }

        setIsTyping(true);
        const timer = setTimeout(() => {
            setDisplayedText(fullDescription.slice(0, displayedText.length + 1));
        }, 30);

        return () => clearTimeout(timer);
    }, [displayedText, flippedIndex, brands]);

    const handleFlip = (index) => {
        setFlippedIndex(flippedIndex === index ? null : index);
        setDisplayedText(''); // Reset typing effect
    };

    const selectedBrand = flippedIndex !== null ? brands[flippedIndex] : null;
    const otherBrands = brands.filter((_, index) => index !== flippedIndex);

    return (
        <div className="brand-container">
            <div className="brand-text">
                <p className="brand-title">Prominent Brands</p>
                <p className="brand-subtitle">
                    <strong>TIMEPIECE</strong> proudly partners with leading global brands.
                    Click a card to discover more.
                </p>
            </div>

            <div className="brand-grid">
                {/* LEFT SIDE - SELECTED CARD */}
                {selectedBrand && (
                    <div
                        key={selectedBrand._id}
                        className="brand-card flipped"
                    >
                        <div className="brand-inner">
                            <div className="brand-front">
                                <img 
                                    src={`http://localhost:5000${selectedBrand.avatar}`} 
                                    alt={selectedBrand.name} 
                                />
                                <p className="brand-name">{selectedBrand.name}</p>
                            </div>

                            <div className="brand-back">
                                <h3>{selectedBrand.name}</h3>
                                <p className="brand-desc">
                                    <span>{displayedText}</span>
                                    {isTyping && (
                                        <span className="cursor-blink">|</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* RIGHT SIDE - OTHER CARDS GRID */}
                <div className="brand-cards-grid">
                    {otherBrands.map((brand, index) => {
                        const originalIndex = brands.findIndex(b => b._id === brand._id);
                        return (
                            <div
                                key={brand._id}
                                className={`brand-card ${flippedIndex === originalIndex ? "flipped" : ""}`}
                                onClick={() => handleFlip(originalIndex)}
                            >
                                <div className="brand-inner">
                                    <div className="brand-front">
                                        <img 
                                            src={`http://localhost:5000${brand.avatar}`} 
                                            alt={brand.name} 
                                        />
                                        <p className="brand-name">{brand.name}</p>
                                    </div>

                                    <div className="brand-back">
                                        <h3>{brand.name}</h3>
                                        <p className="brand-desc">{brand.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}