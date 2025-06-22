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
}

const initialState: AppState = {
    surveyData: null,
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        setSurveyData(state, action: PayloadAction<SurveyData>) {
            state.surveyData = action.payload;
        },
        clearSurveyData(state) {
            state.surveyData = null;
        },
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
            const clone = state.surveyData?.SurveyResponses.map((i) => {
                if (
                    i.ValueJson.QuestionContent.Id === action.payload.questionId
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
        },
        handleUpdateMutilChoice(
            state,
            action: PayloadAction<{ idChoose: number; questionId: number }>
        ) {
            const clone = state.surveyData?.SurveyResponses.map((i) => {
                if (
                    i.ValueJson.QuestionContent.Id === action.payload.questionId
                ) {
                    const prevArr = Array.isArray(
                        (i.ValueJson.QuestionResponse as any)?.MultipleChoice
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
                            (v) => Number(v) !== Number(action.payload.idChoose)
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
        },

        handleChangeSlider(
            state,
            action: PayloadAction<{
                idChoose: number; // questionId
                value: number;
            }>
        ) {
            const clone = state.surveyData?.SurveyResponses.map((i) => {
                if (
                    i.ValueJson.QuestionContent.Id === action.payload.idChoose
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
                                Slider: action.payload.value,
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
        },

        handleChangeRangeSlide(
            state,
            action: PayloadAction<{
                idChoose: number;
                min: number;
                max: number;
            }>
        ) {
            const clone = state.surveyData?.SurveyResponses.map((i) => {
                if (
                    i.ValueJson.QuestionContent.Id === action.payload.idChoose
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
        },
    },
});

export const {
    setSurveyData,
    clearSurveyData,
    handleAddQuestionResponse,
    handleUpdateSigleChoose,
    handleUpdateMutilChoice,
    handleChangeRangeSlide,
    handleChangeSlider,
} = appSlice.actions;
export default appSlice.reducer;
