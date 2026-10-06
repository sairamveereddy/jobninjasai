import { BRAND } from '../config/branding';
import './BrandLogo.css';

const BrandLogo = ({ className = "", hideText = false }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img 
                src={BRAND.logoPath} 
                alt="Logo" 
                className="w-7 h-7 md:w-8 md:h-8 object-contain shrink-0 rounded-[4px]" 
                onError={(e) => e.target.style.display = 'none'}
            />
            {!hideText && (
                <div className="flex items-baseline font-geist">
                    <span className="text-lg md:text-xl font-semibold tracking-[-0.04em] text-foreground">
                        JobNinjas
                    </span>
                    <span className="text-lg md:text-xl font-medium tracking-[-0.04em] text-muted-foreground ml-[1px]">
                        .ai
                    </span>
                </div>
            )}
        </div>
    );
};

export default BrandLogo;
