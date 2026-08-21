import logo from './logo pic/Code_Generated_Image.png'
import homeimg from './logo pic/ChatGPT Image Aug 4, 2026, 11_43_42 AM.png'
import womanpage from '../assets/logo pic/woman/ChatGPT Image Aug 12, 2026, 12_17_45 PM-Picsart-AiImageEnhancer.png';
import Manpage from './logo pic/man/ChatGPT Image Aug 12, 2026, 02_40_15 PM.png';
import accessoriespage from './logo pic/accessories/Gemini_Generated_Image_3jgule3jgule3jgu.png';
import womancoll from './logo pic/woman/Firefly_Gemini Flash (1).png';
import mancoll from './logo pic/woman/ChatGPT Image Aug 12, 2026, 02_20_43 PM.png';
import accessoriescoll from './logo pic/woman/ChatGPT Image Aug 12, 2026, 02_28_47 PM.png';
export { logo, homeimg, womanpage, Manpage,accessoriespage,accessoriescoll , mancoll ,womancoll};

function img({ src, alt = "", className, loading = "lazy" }) {
    return <img src={src} alt={alt} className={className} loading={loading} decoding="async" />;
}

export default img;

