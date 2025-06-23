/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { handleSetIsValid, setSurveyData } from "../../../app/appSlice";

type JumpLogic = {
    Conditions: {
        QuestionId: number;
        Conjunction: "AND" | "OR" | null;
        Operator: string;
        OptionId: number;
        CompareValue: number;
    }[];
    TargetQuestionId: number;
};

type Props = {
    dataResponse: SurveyType | null;
    setIsRefetch: Dispatch<SetStateAction<boolean>>;
};

const HandleSlide = ({ dataResponse, setIsRefetch }: Props) => {
    const [current, setCurrent] = useState(0);
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);
    const dispatch = useAppDispatch();

    // const handleNext = useCallback(() => {
    //     dispatch(handleSetIsValid(true));
    //     if(Math.random()  * 1000> 850 ) {
    //         setIsRefetch(prev => !prev);
    //     }
    //     if (!surveyData?.SurveyResponses) return;
    //     const index = surveyData.SurveyResponses.findIndex(
    //         (item) => item.ValueJson?.QuestionContent?.Id === current
    //     );
    //     const question = surveyData?.SurveyResponses[index];
    //     if (!question?.IsValid) {
    //         return;
    //     }

    //     const configJson = question?.ValueJson?.QuestionContent
    //         ?.ConfigJson as Record<string, any>;
    //     const jump: JumpLogic[] = (configJson?.JumpLogics || []) as JumpLogic[];

    //     if (jump.length) {
    //         for (const logic of jump) {
    //             let isMatch = true;
    //             for (const cond of logic.Conditions) {
    //                 const q = surveyData.SurveyResponses.find(
    //                     (item) =>
    //                         item.ValueJson.QuestionContent.Id ===
    //                         cond.QuestionId
    //                 );
    //                 const questionResponse = q?.ValueJson
    //                     .QuestionResponse as Record<string, any>;
    //                 const selected = questionResponse?.SingleChoice;
    //                 const match = selected === cond.OptionId;

    //                 if (!match) {
    //                     isMatch = false;
    //                     break;
    //                 }
    //             }
    //             if (isMatch) {
    //                 const target = surveyData.SurveyResponses.find(
    //                     (item) =>
    //                         item.ValueJson.QuestionContent.Id ===
    //                         logic.TargetQuestionId
    //                 );
    //                 if (target) {
    //                     setCurrent(target.ValueJson.QuestionContent.Id);
    //                     return;
    //                 }
    //             }
    //         }
    //     }

    //     if (index === -1 || index === surveyData.SurveyResponses.length - 1)
    //         return;
    //     setCurrent(
    //         surveyData.SurveyResponses[index + 1]?.ValueJson?.QuestionContent
    //             ?.Id ?? 0
    //     );
    // }, [surveyData, current]);

    const handleNext = useCallback(() => {
        dispatch(handleSetIsValid(true));

        if (Math.random() * 1000 > 850) {
            setIsRefetch((prev) => !prev);
        }

        if (!surveyData?.SurveyResponses) return;

        const index = surveyData.SurveyResponses.findIndex(
            (item) => item.ValueJson?.QuestionContent?.Id === current
        );
        const question = surveyData?.SurveyResponses[index];

        if (!question?.IsValid) return;

        const configJson = question?.ValueJson?.QuestionContent
            ?.ConfigJson as Record<string, any>;
        const jump: JumpLogic[] = (configJson?.JumpLogics || []) as JumpLogic[];

        if (jump.length) {
            for (const logic of jump) {
                let result: boolean | null = null;

                for (let i = 0; i < logic.Conditions.length; i++) {
                    const cond = logic.Conditions[i];

                    const q = surveyData.SurveyResponses.find(
                        (item) =>
                            item.ValueJson.QuestionContent.Id ===
                            cond.QuestionId
                    );
                    const questionResponse = q?.ValueJson
                        ?.QuestionResponse as Record<string, any>;

                    let isValid = false;

                    if (
                        q?.ValueJson.QuestionContent.QuestionTypeId === 1 ||
                        q?.ValueJson.QuestionContent.QuestionTypeId === 2
                    ) {
                        const selected = questionResponse?.SingleChoice;
                        if (cond.Operator === "Chọn") {
                            isValid = selected === cond.OptionId;
                        }
                        if (cond.Operator === "Không Chọn") {
                            isValid = selected !== cond.OptionId;
                        }
                    }

                    if (q?.ValueJson.QuestionContent.QuestionTypeId === 6) {
                        const value = questionResponse?.Input?.Value;
                        if (cond.Operator === "=") {
                            isValid = value === cond.CompareValue;
                        }
                        if (cond.Operator === ">=") {
                            isValid = value >= cond.CompareValue;
                        }
                        if (cond.Operator === "<=") {
                            isValid = value <= cond.CompareValue;
                        }
                        if (cond.Operator === ">") {
                            isValid = value > cond.CompareValue;
                        }
                        if (cond.Operator === "<") {
                            isValid = value < cond.CompareValue;
                        }
                    }

                    if (i === 0) {
                        result = isValid;
                    } else {
                        if (cond.Conjunction === "AND") {
                            result = result && isValid;
                        } else if (cond.Conjunction === "OR") {
                            result = result || isValid;
                        } else {
                            // Mặc định là AND nếu không có Conjunction
                            result = result && isValid;
                        }
                    }
                }

                if (result) {
                    const target = surveyData.SurveyResponses.find(
                        (item) =>
                            item.ValueJson.QuestionContent.Id ===
                            logic.TargetQuestionId
                    );

                    if (target) {
                        setCurrent(target.ValueJson.QuestionContent.Id);
                        return;
                    }
                }
            }
        }

        // Không có nhảy logic, đi tới câu tiếp theo
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
            <Action
                onNext={handleNext}
                onPrev={handleBack}
                currentQuestionId={current}
            />
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
                            TimeLimit: i?.TimeLimit || 0,
                            SpeechText: i?.SpeechText || "",
                            IsVoice: i?.IsVoice || false,
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
