import { useMemo, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks";

interface ActionProps {
    onNext?: () => void;
    nextLabel?: string;
    currentIndex: number;
    onEnd: () => void;
}

const Action = ({
    onNext,
    nextLabel = "Tiếp tục",
    currentIndex,
    onEnd,
}: ActionProps) => {
    const info = useAppSelector((state) => state.appSlice.infoSurvey);
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);

    const isNext = useMemo(() => {
        return surveyData?.SurveyResponses?.[currentIndex]?.isNext;
    }, [currentIndex, surveyData?.SurveyResponses]);

    const buttonBgColor = useMemo(
        () => info?.ConfigJson?.ButtonBackgroundColor || "#007bff",
        [info?.ConfigJson?.ButtonBackgroundColor]
    );
    const buttonTextColor = useMemo(
        () => info?.ConfigJson?.ButtonContentColor || "#ffffff",
        [info?.ConfigJson?.ButtonContentColor]
    );
    const data = useAppSelector((state) => state.appSlice.surveyData);
    const isValid = useMemo(
        () => (data?.SurveyResponses || [])[currentIndex]?.IsValid,
        [currentIndex, data?.SurveyResponses]
    );

    const isEnd = useMemo(() => {
        const current = surveyData?.SurveyResponses?.[currentIndex];
        console.log("current >>> ", current);
        return current?.isEnd;
    }, [currentIndex, surveyData?.SurveyResponses]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (!isNext) return;
                if (isEnd) {
                    if (onEnd) onEnd();
                } else {
                    if (onNext) onNext();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEnd, onEnd, onNext, isNext]);

    return (
        <div className="flex items-center justify-center gap-6 py-6 bg-transparent">
            <button
                onClick={() => {
                    if (!isNext) return;
                    if (isEnd) {
                        if (onEnd) onEnd();
                    } else {
                        if (onNext) onNext();
                    }
                }}
                className={`btn-next group cursor-pointer ${
                    !isNext && "opacity-[0.5] cursor-not-allowed"
                }`}
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
                    color: isValid ? buttonTextColor : "white",
                }}
                disabled={isNext === false}
            >
                {!isEnd ? nextLabel : "Kết thúc"}
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
            {!isEnd ? (
                <span className="text-white font-semibold ml-2 bg-gray-300 px-4 py-2 rounded-[99px]">
                    hoặc nhấn <span className="font-bold">ENTER</span>
                </span>
            ) : null}
        </div>
    );
};

export default Action;
