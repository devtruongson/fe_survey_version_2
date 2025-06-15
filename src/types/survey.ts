export type OptionType = {
    Id?: number | null;
    Content: string;
    Order: number;
    Image?: string; // base64 image data
};

export type SlideType = {
    Min: number;
    Max: number;
    Step: number;
    Unit: string;
};

export type JumpLogicsType = {
    Conditions: {
        QuestionOrder: number;
        Conjunction: string;
        Operator: string;
        CompareValue: number;
    }[];
    TargetQuestionOrder: number;
};
export type QuestionType = {
    Id?: number | null;
    ImageHeader?: string;
    QuestionTypeId: number;
    Content: string;
    Description: string;
    TimeLimit: number;
    IsVoice: boolean;
    Order: number;
    ConfigJson: Record<string, string | number | SlideType[] | JumpLogicsType[]>;
    Options: OptionType[];
};

export type SurveyType = {
    Id: number;
    RequesterId: number;
    Title: string;
    Description: string;
    IsPause: boolean;
    MarketSurveyVersionStatusId: number | null;
    SurveyTypeId: number;
    SurveyTopicId: number;
    SurveySpecificTopicId: number;
    SurveyStatusId: number;
    SecurityModeId: number;
    Background: string;
    ImageBase64?: string;
    BackgroundImageBase64?: string;
    IsUseBackgroundImageBase64?: boolean;
    CustomBackgroundImageUrl?: string | null;
    ConfigJson: {
        BackgroundGradient1Color: string;
        BackgroundGradient2Color: string;
        TitleColor: string;
        ContentColor: string;
        ButtonBackgroundColor: string;
        ButtonContentColor: string;
        Password: string | null;
        Brightness: number;
        IsResizableIframeEnabled?: boolean;
        DefaultBackgroundImageId: number;
    };
    Questions: QuestionType[];
    SkipStartPage: boolean;
};

export interface PageProps {
    isDisable: boolean;
    formData: SurveyType;
    setFormData: React.Dispatch<React.SetStateAction<SurveyType>>;
    handleTabClick: (tabValue: number) => void;
    isTrigger: boolean;
}
