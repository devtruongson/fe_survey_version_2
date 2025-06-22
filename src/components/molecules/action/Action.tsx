import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";

interface ActionProps {
    onPrev?: () => void;
    onNext?: () => void;
    isFirst?: boolean;
    nextLabel?: string;
    currentQuestionId: number;
}

const Action = ({
    onPrev,
    onNext,
    isFirst = false,
    nextLabel = "Tiếp tục",
    currentQuestionId,
}: ActionProps) => {
    const data = useAppSelector((state) => state.appSlice.surveyData);
    const isValid = useMemo(
        () =>
            (data?.SurveyResponses || []).find(
                (i) => i.ValueJson.QuestionContent.Id === currentQuestionId
            )?.IsValid,
        [currentQuestionId, data?.SurveyResponses]
    );
    return (
        <div className="flex items-center justify-center gap-6 py-6 bg-transparent">
            {/* Quay lại */}
            <button
                onClick={onPrev}
                disabled={isFirst}
                className={`flex items-center bg-none border-none text-white font-medium text-lg transition-opacity ${
                    isFirst
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-80"
                }`}
                type="button"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Quay lại
            </button>

            {/* Tiếp tục */}
            <button
                onClick={onNext}
                className={`${
                    isValid ? "bg-[#20607b]" : ""
                } text-white font-semibold text-xl rounded-lg px-8 py-3 flex items-center gap-2 transition`}
                type="button"
            >
                {nextLabel}
                {/* Check SVG */}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </button>

            {/* Hoặc nhấn ENTER */}
            <span className="text-white font-semibold ml-2">
                hoặc nhấn <span className="font-bold">ENTER</span>
            </span>
        </div>
    );
};

export default Action;
