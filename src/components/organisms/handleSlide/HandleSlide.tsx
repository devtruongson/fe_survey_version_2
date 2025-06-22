import {
    useState,
    useCallback,
    type SetStateAction,
    type Dispatch,
} from "react";
import { setSurveyData } from "../../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { SurveyType } from "../../../types/survey";
import Action from "../../molecules/action/Action";
import Slide from "../slide/Slide";

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
    const dispatch = useAppDispatch();

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
            <button onClick={handleStart}>Start</button>
        </div>
    );
};
