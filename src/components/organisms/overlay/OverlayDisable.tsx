import { useNavigate } from "react-router-dom";
import { routesMap } from "../../../routes/routes";

export default function OverlayDisable() {
    const navigate = useNavigate();
    return (
        <div className="overlay absolute right-0 left-0 bottom-0 bg-white/80 top-[55px] z-[9999999] flex justify-center items-center">
            <button
                className="px-6 py-3 rounded-lg cursor-pointer"
                style={{
                    backgroundColor: "#5daf4d",
                    color: "white",
                }}
                onClick={() => navigate(routesMap.Home)}
            >
                Về trang chủ
            </button>
        </div>
    );
}
