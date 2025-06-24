/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    IsValid: boolean;
    ValueJson: {
        QuestionContent: IQuestionContent;
        QuestionResponse: unknown;
    };
}

interface SurveyData {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.questionId} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.questionId} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.idChoose} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.idChoose} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.idChoose} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.idChoose} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                            IsValid: true,
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
                        IsValid: true,
                    };
                });
                if (state.surveyData && clone) {
                    state.surveyData.SurveyResponses = clone;
                }
            } else {
                const mess = `. Câu ${action.payload.idChoose} Thời điểm ghi nhận không hợp lệ`;
                if (
                    state.surveyData &&
                    !state.surveyData.InvalidReason.includes(mess)
                ) {
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
                                QuestionContent: {
                                    ...i.ValueJson.QuestionContent,
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
} = appSlice.actions;
export default appSlice.reducer;
