/* eslint-disable @typescript-eslint/no-explicit-any */
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
    useCallback,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { handleSetIsValid, setSurveyData } from "../../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { routesMap } from "../../../routes/routes";
import type { SurveyType } from "../../../types/survey";
import Action from "../../molecules/action/Action";
import Slide from "../slide/Slide";
import "./styles.scss";
import { useUpdateSurveyPro } from "../../../services/survey/update-pro";

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchParams] = useSearchParams();
    const taken_subject = useMemo(
        () => searchParams.get("taking_subject"),
        [searchParams]
    );
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { mutate } = useUpdateSurveyPro({
        mutationConfig: {
            onSuccess() {},
        },
    });

    const handleNext = useCallback(() => {
        dispatch(handleSetIsValid(true));

        if (Math.random() * 1000 > 900) {
            setIsRefetch((prev) => !prev);
        }

        if (!surveyData?.SurveyResponses) return;

        const question = surveyData?.SurveyResponses[currentIndex];

        // if (!question?.IsValid) return;

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
                            result = result && isValid;
                        }
                    }
                }

                if (result) {
                    let targetIndex = -1;
                    for (
                        let i = surveyData.SurveyResponses.length - 1;
                        i >= 0;
                        i--
                    ) {
                        if (
                            surveyData.SurveyResponses[i].ValueJson
                                .QuestionContent.Id === logic.TargetQuestionId
                        ) {
                            targetIndex = i;
                            break;
                        }
                    }

                    if (targetIndex !== -1) {
                        const target = surveyData.SurveyResponses[targetIndex];
                        setCurrent(target.ValueJson.QuestionContent.Id);
                        setCurrentIndex(targetIndex);
                        return;
                    }
                }
            }
        }

        if (
            currentIndex === -1 ||
            currentIndex === surveyData.SurveyResponses.length - 1
        )
            return;

        const nextIndex = currentIndex + 1;
        const nextQuestion = surveyData.SurveyResponses[nextIndex];
        setCurrentIndex(nextIndex);
        setCurrent(nextQuestion?.ValueJson?.QuestionContent?.Id ?? 0);
    }, [surveyData, currentIndex]);

    const handleEnd = useCallback(() => {
        if (!surveyData || !id) return;
        const dataBuider = {
            ...surveyData,
            taken_subject: taken_subject,
            SurveyResponses: surveyData?.SurveyResponses?.map((i) => ({
                IsValid: i.IsValid,
                ValueJson: {
                    ...i.ValueJson,
                    QuestionContent: {
                        Id: i.ValueJson.QuestionContent.Id,
                        QuestionTypeId:
                            i.ValueJson.QuestionContent.QuestionTypeId,
                        Content: i.ValueJson.QuestionContent.Content,
                        Description: i.ValueJson.QuestionContent.Description,
                        ConfigJson: (() => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { JumpLogics, ...rest } = (i.ValueJson
                                .QuestionContent.ConfigJson || {}) as {
                                [key: string]: any;
                            };
                            return rest;
                        })(),
                        Options: i.ValueJson.QuestionContent.Options,
                    },
                },
            })),
        };
        mutate(dataBuider);
        navigate(routesMap.EndSurveyCustomer.replace("/:id", `/${id}`));
    }, [id, mutate, navigate, surveyData, taken_subject]);

    if (!surveyData?.SurveyResponses?.length) {
        return (
            <Start
                dataResponse={dataResponse}
                setCurrent={setCurrent}
                setCurrentIndex={setCurrentIndex}
            />
        );
    }

    return (
        <div className="w-[60%]">
            <Slide currentQuestionId={current} />
            <Action
                onNext={handleNext}
                currentIndex={currentIndex}
                onEnd={handleEnd}
            />
        </div>
    );
};

export default HandleSlide;

const Start = ({
    dataResponse,
    setCurrent,
    setCurrentIndex,
}: {
    dataResponse: SurveyType | null;
    setCurrent: Dispatch<SetStateAction<number>>;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
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
            let dataStore = (dataResponse?.Questions || []).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (i: any) => ({
                    isEnd: false,
                    IsValid: true,
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
                            ...(i?.IsVoice && {
                                SpeechText: i?.SpeechText || "",
                            }),
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

            if (dataStore.length > 5) {
                const duplicateCount = Math.floor(dataStore.length * 0.2);
                const getRandomUniqueIndices = (
                    maxIndex: number,
                    count: number
                ) => {
                    const indices = new Set<number>();
                    while (indices.size < count && indices.size < maxIndex) {
                        indices.add(Math.floor(Math.random() * maxIndex));
                    }
                    return Array.from(indices);
                };
                const duplicateIndices = getRandomUniqueIndices(
                    dataStore.length,
                    duplicateCount
                );

                const duplicatedItems = duplicateIndices.map(
                    (index) => dataStore[index]
                );
                const newData = duplicatedItems.map((i, indexChild) => {
                    if (indexChild === duplicatedItems.length - 1) {
                        return {
                            ...i,
                            isEnd: true,
                        };
                    }
                    return i;
                });
                dataStore = [...dataStore, ...newData];
            }

            // Set isEnd: true for the last question of the entire survey
            if (dataStore.length > 0) {
                dataStore[dataStore.length - 1] = {
                    ...dataStore[dataStore.length - 1],
                    isEnd: true,
                };
            }

            dispatch(
                setSurveyData({
                    taken_subject: "Preview",
                    InvalidReason: "",
                    SurveyResponses: dataStore,
                })
            );
            if (
                dataResponse?.Questions?.length &&
                dataResponse?.Questions[0]?.Id
            ) {
                setCurrent(dataResponse?.Questions[0]?.Id);
                setCurrentIndex(0);
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
