/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { SurveyType } from "../../../types/survey";
import "./styles.scss";

interface SharePageProps {
    formData: SurveyType;
}

const SharePage = ({ formData }: SharePageProps) => {
    const getBackgroundMode = (data: SurveyType) => {
        if (data.Background === "custom" && data.CustomBackgroundImageUrl) {
            return "image";
        } else if (data.Background.startsWith("/assets/start")) {
            return "image";
        } else if (
            data.Background.startsWith("#") ||
            data.Background === "color_gradient"
        ) {
            return "color";
        }
        return "image"; // Default to image mode
    };

    const backgroundMode = getBackgroundMode(formData);
    const [isCopyLink, setIsCopyLink] = useState(false);

    return (
        <div
            className="startpage-root flex"
            style={{ height: "100vh", overflow: "hidden" }}
        >
            <div
                className="relative flex-1 flex items-center justify-center"
                style={{
                    ...(backgroundMode === "image" && {
                        backgroundImage: `url(${
                            formData.CustomBackgroundImageUrl ||
                            formData.Background
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter: `Brightness(${
                            formData.ConfigJson.Brightness / 100
                        })`,
                        backgroundColor: "transparent",
                    }),
                    ...(backgroundMode === "color" && {
                        ...(formData.Background.startsWith("#")
                            ? {
                                  backgroundColor: formData.Background,
                              }
                            : {
                                  background: `linear-gradient(to right, ${formData.ConfigJson.BackgroundGradient1Color}, ${formData.ConfigJson.BackgroundGradient2Color})`,
                              }),
                    }),
                }}
            >
                <div className="flex justify-center">
                    <div className="bg-white p-5 rounded-lg w-[1200px]">
                        <h3
                            className="text-2xl font-semibold mb-4 text-center"
                            style={{
                                color:
                                    formData.ConfigJson.TitleColor ||
                                    "#ffffff",
                            }}
                        >
                            CHIA SẺ KHẢO SÁT CỦA BẠN
                        </h3>
                        <p className="text-center">
                            Sao chép đường dẫn sau và gửi cho bạn bè của bạn
                            hoặc đáp viên
                        </p>
                        <hr className="my-4 border-gray-300" />
                        <div className="text-center">
                            <p>
                                Bạn phải hoàn tất khảo sát để nhận đường dẫn
                                chia sẻ
                            </p>
                            <hr className="my-4 border-gray-300" />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Hoàn tất
                            </button>
                            <hr className="my-4 border-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="startpage-options w-[420px] bg-white h-full overflow-y-auto shadow-lg p-8"
                style={{ overflowY: "auto" }}
            >
                <div className="config-section">
                    <h3 className="config-title">TẠO ĐƯỜNG LINK RÚT GỌN</h3>
                    <div>
                        <div className="flex items-center justify-between">
                            <button
                                style={{
                                    backgroundImage:
                                        "linear-gradient(-30deg, rgb(23, 234, 217), rgb(96, 120, 234))",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/survey/share/${formData.Id}`
                                    );
                                    setIsCopyLink(true);
                                    setTimeout(() => {
                                        setIsCopyLink(false);
                                    }, 2000);
                                }}
                            >
                                {isCopyLink ? "Đã sao chép" : "Sao chép"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePage;
