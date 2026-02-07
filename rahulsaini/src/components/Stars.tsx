import { useEffect, useState } from 'react';

interface Star {
    id: number;
    left: string;
    top: string;
    duration: string;
    delay: string;
    maxOpacity: number;
}

export default function Stars() {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        // Generate stars only once on mount for performance
        const generatedStars: Star[] = Array.from({ length: 150 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${2 + Math.random() * 4}s`,
            delay: `${Math.random() * 5}s`,
            maxOpacity: 0.4 + Math.random() * 0.6,
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="stars">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: star.left,
                        top: star.top,
                        '--duration': star.duration,
                        animationDelay: star.delay,
                        '--max-opacity': star.maxOpacity,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}
