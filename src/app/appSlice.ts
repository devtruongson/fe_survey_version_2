/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface IQuestionContent {
    Id: number;
    MainImageUrl: string;
    QuestionTypeId: number;
    Content: string;
    Description: string;
    ConfigJson: unknown;
    Options: [];
}

interface SurveyResponse {
    isEnd?: boolean;
    isNext?: boolean;
    IsValid: boolean;
    ValueJson: {
        QuestionContent: IQuestionContent;
        QuestionResponse: unknown;
    };
}

interface SurveyData {
    taken_subject?: string;
    InvalidReason: string;
    SurveyResponses: SurveyResponse[];
}

interface AppState {
    surveyData: SurveyData | null;
    infoSurvey: any;
    isValid: boolean;
}

const initialState: AppState = {
    surveyData: null,
    infoSurvey: null,
    isValid: false,
};

// Helper function để so sánh câu trả lời
const compareAnswers = (answer1: any, answer2: any, questionType: string) => {
    if (!answer1 || !answer2) return true; // Nếu một trong hai chưa trả lời thì không so sánh

    switch (questionType) {
        case "SingleChoice":
            return answer1.SingleChoice === answer2.SingleChoice;
        case "MultipleChoice":
            const arr1 = Array.isArray(answer1.MultipleChoice)
                ? answer1.MultipleChoice.sort()
                : [];
            const arr2 = Array.isArray(answer2.MultipleChoice)
                ? answer2.MultipleChoice.sort()
                : [];
            return JSON.stringify(arr1) === JSON.stringify(arr2);
        case "Input":
            return answer1.Input?.Value === answer2.Input?.Value;
        case "Range":
            return (
                answer1.Range?.Min === answer2.Range?.Min &&
                answer1.Range?.Max === answer2.Range?.Max
            );
        case "Ranking":
            return (
                JSON.stringify(answer1.Ranking) ===
                JSON.stringify(answer2.Ranking)
            );
        default:
            return true;
    }
};

// Helper function để validate câu trả lời lặp lại
const validateDuplicateAnswers = (
    state: any,
    currentQuestionId: number,
    questionType: string
) => {
    const responses = state.surveyData?.SurveyResponses || [];

    // Tìm tất cả câu hỏi có cùng ID (bao gồm câu gốc và câu lặp)
    const sameQuestions = responses.filter(
        (response: any) =>
            response.ValueJson.QuestionContent.Id === currentQuestionId
    );

    if (sameQuestions.length > 1) {
        // Lấy câu trả lời đầu tiên (câu gốc)
        const firstAnswer = sameQuestions[0]?.ValueJson.QuestionResponse;

        // So sánh với các câu còn lại
        for (let i = 1; i < sameQuestions.length; i++) {
            const currentAnswer = sameQuestions[i]?.ValueJson.QuestionResponse;

            if (!compareAnswers(firstAnswer, currentAnswer, questionType)) {
                const mess = `. Câu ${currentQuestionId} có câu trả lời không nhất quán giữa các lần lặp lại`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
                break;
            }
        }
    }
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        handleSetInfoSurvey(state, action: PayloadAction<SurveyData>) {
            state.infoSurvey = action.payload;
        },
        setSurveyData(state, action: PayloadAction<SurveyData>) {
            state.surveyData = action.payload;
        },
        // // clearSurveyData(state) {
        // //     state.surveyData = null;
        // // },
        handleAddQuestionResponse(
            state,
            action: PayloadAction<SurveyResponse>
        ) {
            if (state.surveyData) {
                state.surveyData.SurveyResponses = [
                    ...state.surveyData.SurveyResponses,
                    action.payload,
                ];
            }
        },
        // Cập nhật các handler functions
        handleUpdateSigleChoose(
            state,
            action: PayloadAction<{ idChoose: number; questionId: number }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    SingleChoice: action.payload.idChoose,
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.questionId,
                        "SingleChoice"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.questionId
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleUpdateMutilChoice(
            state,
            action: PayloadAction<{ idChoose: number; questionId: number }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                    ) {
                        const prevArr = Array.isArray(
                            (i.ValueJson.QuestionResponse as any)
                                ?.MultipleChoice
                        )
                            ? [
                                  ...(i.ValueJson.QuestionResponse as any)
                                      .MultipleChoice,
                              ]
                            : [];
                        const idx = prevArr.findIndex(
                            (v) => Number(v) === Number(action.payload.idChoose)
                        );
                        let newArr;
                        if (idx > -1) {
                            newArr = prevArr.filter(
                                (v) =>
                                    Number(v) !==
                                    Number(action.payload.idChoose)
                            );
                        } else {
                            newArr = [...prevArr, action.payload.idChoose];
                        }
                        return {
                            // IsValid: true,
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    MultipleChoice: newArr,
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.questionId,
                        "MultipleChoice"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.questionId
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleChangeSlider(
            state,
            action: PayloadAction<{
                idChoose: number; // questionId
                value: number;
            }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    Input: {
                                        Value: action.payload.value,
                                        ValueType: "number",
                                    },
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.idChoose,
                        "Input"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.idChoose
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleChangeRangeSlide(
            state,
            action: PayloadAction<{
                idChoose: number;
                min: number;
                max: number;
            }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    Range: {
                                        Min: action.payload.min,
                                        Max: action.payload.max,
                                    },
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.idChoose,
                        "Range"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.idChoose
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleUpdateRating(
            state,
            action: PayloadAction<{
                idChoose: number; // questionId
                value: number;
            }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    Input: {
                                        Value: action.payload.value,
                                        ValueType: "number",
                                    },
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.idChoose,
                        "Input"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.idChoose
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleUpdateRaking(
            state,
            action: PayloadAction<{
                idChoose: number;
                ranking: { SurveyOptionId: number; RankIndex: number }[];
            }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    Ranking: action.payload.ranking,
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.idChoose,
                        "Ranking"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.idChoose
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },

        handleUpdateForm(
            state,
            action: PayloadAction<{
                idChoose: number;
                type: number;
                value: string | number;
            }>
        ) {
            if (!state.isValid) {
                const type = action.payload.type;
                const value = action.payload.value;
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                    ) {
                        return {
                            ...i,
                            isNext: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...((typeof i.ValueJson.QuestionResponse ===
                                        "object" &&
                                        i.ValueJson.QuestionResponse) ||
                                        {}),
                                    Input: {
                                        Value: value,
                                        ValueType:
                                            type === 4 ? "number" : "string",
                                    },
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        // IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                    // Validate câu trả lời lặp lại
                    validateDuplicateAnswers(
                        state,
                        action.payload.idChoose,
                        "Input"
                    );
                }
            } else {
                if (!state.surveyData) return;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.idChoose
                            ? { ...i, IsValid: false }
                            : i
                    );
                const mess = `${
                    state.surveyData.InvalidReason ? ". " : ""
                }Câu ${
                    action.payload.idChoose
                } Thời điểm ghi nhận không hợp lệ`;
                if (!state.surveyData.InvalidReason.includes(mess)) {
                    state.surveyData.InvalidReason =
                        state.surveyData.InvalidReason + mess;
                }
            }
        },
        handleSetIsValid(state, action: PayloadAction<boolean>) {
            state.isValid = action.payload;
        },

        handleUpdateSpeechText(
            state,
            action: PayloadAction<{ text: string; questionId: number }>
        ) {
            if (!state.isValid) {
                const clone = state.surveyData?.SurveyResponses.map((i) => {
                    if (
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                    ) {
                        return {
                            ...i,
                            IsValid: true,
                            ValueJson: {
                                ...i.ValueJson,
                                QuestionResponse: {
                                    ...(typeof i.ValueJson.QuestionResponse ===
                                        "object" && i.ValueJson.QuestionResponse
                                        ? i.ValueJson.QuestionResponse
                                        : {}),
                                    SpeechText: action.payload.text,
                                },
                            },
                        };
                    }
                    return {
                        ...i,
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            }
        },

        handleUpdateInvalidReason(
            state,
            action: PayloadAction<{ questionId: number }>
        ) {
            if (state.surveyData) {
                state.surveyData.InvalidReason =
                    state.surveyData.InvalidReason +
                    `${state.surveyData.InvalidReason ? ". " : ""}Câu ${
                        action.payload.questionId
                    } phát hiện đầu vào ẩn`;
                state.surveyData.SurveyResponses =
                    state.surveyData.SurveyResponses.map((i) =>
                        i.ValueJson.QuestionContent.Id ===
                        action.payload.questionId
                            ? { ...i, IsValid: false }
                            : i
                    );
            }
        },
    },
});

export const {
    setSurveyData,
    // clearSurveyData,
    handleSetInfoSurvey,
    handleAddQuestionResponse,
    handleUpdateSigleChoose,
    handleUpdateMutilChoice,
    handleChangeRangeSlide,
    handleChangeSlider,
    handleUpdateRating,
    handleUpdateRaking,
    handleUpdateForm,
    handleSetIsValid,
    handleUpdateSpeechText,
    handleUpdateInvalidReason,
} = appSlice.actions;
export default appSlice.reducer;
