import "./styles.scss";
import {
    useState,
    useCallback,
    type SetStateAction,
    type Dispatch,
    useMemo,
} from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { SurveyType } from "../../../types/survey";
import Action from "../../molecules/action/Action";
import Slide from "../slide/Slide";
import { setSurveyData } from "../../../app/appSlice";

type Props = {
    dataResponse: SurveyType | null;
};

const HandleSlide = ({ dataResponse }: Props) => {
    const [current, setCurrent] = useState(0);
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);

    const handleNext = useCallback(() => {
        if (!surveyData?.SurveyResponses) return;
        const index = surveyData.SurveyResponses.findIndex(
            (item) => item.ValueJson?.QuestionContent?.Id === current
        );
        if (!surveyData?.SurveyResponses[index]?.IsValid) {
            return;
        }
        if (index === -1 || index === surveyData.SurveyResponses.length - 1)
            return;
        setCurrent(
            surveyData.SurveyResponses[index + 1]?.ValueJson?.QuestionContent
                ?.Id ?? 0
        );
    }, [surveyData, current]);

    const handleBack = useCallback(() => {
        if (!surveyData?.SurveyResponses) return;
        const index = surveyData.SurveyResponses.findIndex(
            (item) => item.ValueJson?.QuestionContent?.Id === current
        );
        if (index <= 0) return;
        setCurrent(
            surveyData.SurveyResponses[index - 1]?.ValueJson?.QuestionContent
                ?.Id ?? 0
        );
    }, [surveyData, current]);

    if (!surveyData?.SurveyResponses?.length) {
        return <Start dataResponse={dataResponse} setCurrent={setCurrent} />;
    }

    return (
        <div className="">
            <Slide currentQuestionId={current} />
            <Action onNext={handleNext} onPrev={handleBack} />
        </div>
    );
};

export default HandleSlide;

const Start = ({
    dataResponse,
    setCurrent,
}: {
    dataResponse: SurveyType | null;
    setCurrent: Dispatch<SetStateAction<number>>;
}) => {
    const data = useAppSelector((state) => state.appSlice.infoSurvey);
    const dispatch = useAppDispatch();

    const buttonBgColor = useMemo(
        () => data?.ConfigJson?.ButtonBackgroundColor || "#007bff",
        [data?.ConfigJson?.ButtonBackgroundColor]
    );
    const buttonTextColor = useMemo(
        () => data?.ConfigJson?.ButtonContentColor || "#ffffff",
        [data?.ConfigJson?.ButtonContentColor]
    );

    const handleStart = () => {
        if (dataResponse) {
            const dataStore = (dataResponse?.Questions || []).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (i: any) => ({
                    IsValid: false,
                    ValueJson: {
                        QuestionContent: {
                            Id: i?.Id || null,
                            MainImageUrl: i?.MainImageUrl || "",
                            QuestionTypeId: i?.QuestionTypeId || 0,
                            Content: i?.Content || "",
                            Description: i?.Description || "",
                            ConfigJson: i?.ConfigJson || {},
                            Options: i?.Options || [],
                        },
                        QuestionResponse: {
                            Input: null,
                            Range: null,
                            Ranking: null,
                            SingleChoice: null,
                            MultipleChoice: null,
                            SpeechText: null,
                        },
                    },
                })
            );
            dispatch(
                setSurveyData({
                    InvalidReason: "",
                    SurveyResponses: dataStore,
                })
            );
            if (
                dataResponse?.Questions?.length &&
                dataResponse?.Questions[0]?.Id
            ) {
                setCurrent(dataResponse?.Questions[0]?.Id);
            }
        }
    };
    return (
        <div className="">
            <p
                className="text-[32px] text-center mb-4"
                style={{ color: data?.ConfigJson?.TitleColor || "#FFFFFF" }}
            >
                {data?.Title}
            </p>
            <p
                style={{ color: data?.ConfigJson?.ContentColor || "#CCCCCC" }}
                className="text-[24px] text-center mb-6"
            >
                {data?.Description}
            </p>
            <button
                onClick={handleStart}
                className="startpage-btn group cursor-pointer"
                style={{
                    background:
                        buttonBgColor?.startsWith("linear-gradient") ||
                        buttonBgColor?.startsWith("radial-gradient")
                            ? buttonBgColor
                            : "",
                    backgroundColor: !(
                        buttonBgColor?.startsWith("linear-gradient") ||
                        buttonBgColor?.startsWith("radial-gradient")
                    )
                        ? buttonBgColor
                        : "",
                    color: buttonTextColor,
                }}
            >
                <span>Bắt đầu</span>
                <span className="startpage-icon-wrapper">
                    <ChevronRightIcon />
                </span>
            </button>
        </div>
    );
};
