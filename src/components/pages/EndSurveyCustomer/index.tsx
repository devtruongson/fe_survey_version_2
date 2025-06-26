import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import axios from "../../../libs/axios";

const EndSurveyCustomer = () => {
    const survey = useAppSelector((state) => state.appSlice.surveyData);
    const info = useAppSelector((state) => state.appSlice.infoSurvey);

    const [listBackgroundImage, setListBackgroundImage] = useState<
        { id: number; url: string }[]
    >([]);

    useEffect(() => {
        const fetchBackgrounds = async () => {
            const response = await axios.get("/survey/all-bg");
            setListBackgroundImage(response.data.data);
        };
        fetchBackgrounds();
    }, []);
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-white z-50 px-[100px]`}
            style={{
                ...(info?.Background === "color_gradient"
                    ? {
                          backgroundColor:
                              info?.ConfigJson?.BackgroundGradient1Color,
                      }
                    : info?.IsUseBackgroundImageBase64
                    ? {
                          backgroundImage: `url(${info?.BackgroundImageBase64})`,
                      }
                    : {
                          backgroundImage: `url(${
                              listBackgroundImage.find(
                                  (item) =>
                                      item.id ===
                                      info?.ConfigJson?.DefaultBackgroundImageId
                              )?.url
                          })`,
                      }),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: `brightness(${
                    info?.ConfigJson?.Brightness
                        ? info?.ConfigJson?.Brightness
                        : 100
                }%)`,
            }}
        >
            <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                {survey &&
                typeof survey.InvalidReason === "string" &&
                survey.InvalidReason.trim() !== "" ? (
                    survey.InvalidReason.split(". ").map((i, index) =>
                        i.trim() !== "" ? (
                            <div
                                className="w-full px-5 py-3 rounded-[8px] bg-red-500 text-white mb-4"
                                key={index}
                            >
                                {i}
                            </div>
                        ) : null
                    )
                ) : (
                    <div className="text-gray-500">
                        Không có dữ liệu hoặc lý do kết thúc khảo sát.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EndSurveyCustomer;
