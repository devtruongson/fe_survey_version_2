import { useEffect, useMemo, useState } from "react";
import useBlocker from "../../../hooks/useBlocker";
import { useParams } from "react-router-dom";
import { useGetSurvey } from "../../../services/survey/get";
import axios from "../../../libs/axios";
import type { QuestionType, SurveyType } from "../../../types/survey";
import { useAppDispatch } from "../../../app/hooks";
import { handleSetInfoSurvey, handleSetIsValid } from "../../../app/appSlice";
import HandleSlide from "../../organisms/handleSlide/HandleSlide";
import TurnstileWidget from "../../../hooks/useRecapcha";

function SurveyCustomer() {
    const [isVerified, setIsVerified] = useState(false);
    const [isRefetch, setIsRefetch] = useState(false);
    const [dataResponse, setDataResponse] = useState<SurveyType | null>(null);
    const [listBackgroundImage, setListBackgroundImage] = useState<
        { id: number; url: string }[]
    >([]);

    const dispatch = useAppDispatch();
    useBlocker(true);

    const { id } = useParams();
    const { data } = useGetSurvey({ id: Number(id) || 0 });

    useEffect(() => {
        if (data) {
            setDataResponse(data?.data);
            dispatch(handleSetInfoSurvey(data?.data));
        }
    }, [data]);

    useEffect(() => {
        const fetchBackgrounds = async () => {
            const response = await axios.get("/survey/all-bg");
            setListBackgroundImage(response.data.data);
        };
        fetchBackgrounds();
    }, []);

    useEffect(() => {
        if(isVerified) {
            dispatch(handleSetIsValid(false));
        }else {
            dispatch(handleSetIsValid(true));
        }
    }, [isVerified])

    if (!dataResponse) return null;

    return (
        <div>
            <TurnstileWidget
                isVerified={isVerified}
                setIsVerified={setIsVerified}
                isRefetch={isRefetch}
            /> 
            <div
                className={`fixed top-0 left-0 w-full h-full bg-white z-50`}
                style={{
                    ...(dataResponse?.Background === "color_gradient"
                        ? {
                              backgroundColor:
                                  dataResponse.ConfigJson
                                      .BackgroundGradient1Color,
                          }
                        : dataResponse?.IsUseBackgroundImageBase64
                        ? {
                              backgroundImage: `url(${dataResponse.BackgroundImageBase64})`,
                          }
                        : {
                              backgroundImage: `url(${
                                  listBackgroundImage.find(
                                      (item) =>
                                          item.id ===
                                          dataResponse.ConfigJson
                                              .DefaultBackgroundImageId
                                  )?.url
                              })`,
                          }),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: `brightness(${
                        dataResponse.ConfigJson.Brightness
                            ? dataResponse.ConfigJson.Brightness
                            : 100
                    }%)`,
                }}
            >
                <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                    <HandleSlide setIsRefetch={setIsRefetch} dataResponse={dataResponse} />
                </div>
            </div>
        </div>
    );
}

export default SurveyCustomer;
