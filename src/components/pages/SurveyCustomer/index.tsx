/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useBlocker from "../../../hooks/useBlocker";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../../../libs/axios";
import type { SurveyType } from "../../../types/survey";
import { useAppDispatch } from "../../../app/hooks";
import { handleSetInfoSurvey, handleSetIsValid } from "../../../app/appSlice";
import HandleSlide from "../../organisms/handleSlide/HandleSlide";
import TurnstileWidget from "../../../hooks/useRecapcha";
import { useGetSlide } from "../../../services/survey/get-slide";

function SurveyCustomer() {
    const [isVerified, setIsVerified] = useState(false);
    const [isRefetch, setIsRefetch] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [dataResponse, setDataResponse] = useState<SurveyType | null>(null);
    const [listBackgroundImage, setListBackgroundImage] = useState<
        { id: number; url: string }[]
    >([]);

    const dispatch = useAppDispatch();

    const { id } = useParams();

    const { data: apiData } = useGetSlide({ id: Number(id) || 0 });

    useEffect(() => {
        if (apiData) {
            setDataResponse(apiData.data);
            dispatch(handleSetInfoSurvey(apiData.data));

            if (apiData.data?.Version) {
                const currentParams = new URLSearchParams(searchParams);
                currentParams.set("Version", apiData.data.Version.toString());
                setSearchParams(currentParams);
            }
        }
    }, [apiData, dispatch, searchParams, setSearchParams]);

    useEffect(() => {
        const fetchBackgrounds = async () => {
            const response = await axios.get("/survey/all-bg");
            setListBackgroundImage(response.data.data);
        };
        fetchBackgrounds();
    }, []);

    useEffect(() => {
        if (isVerified) {
            dispatch(handleSetIsValid(false));
        } else {
            dispatch(handleSetIsValid(true));
        }
    }, [isVerified]);

    useBlocker(true);

    if (!dataResponse) return null;

    return (
        <div>
            <TurnstileWidget
                isVerified={isVerified}
                setIsVerified={setIsVerified}
                isRefetch={isRefetch}
            />
            <div
                className={`py-[60px] w-full min-h-[100vh] bg-white z-50`}
                style={{
                    ...((dataResponse as any)?.Background === "color_gradient"
                        ? {
                              backgroundColor:
                                  dataResponse.ConfigJson
                                      .BackgroundGradient1Color,
                          }
                        : (dataResponse as any)?.IsUseBackgroundImageBase64
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
                    <HandleSlide
                        setIsRefetch={setIsRefetch}
                        dataResponse={dataResponse}
                    />
                </div>
            </div>
        </div>
    );
}

export default SurveyCustomer;
