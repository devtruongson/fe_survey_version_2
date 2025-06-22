import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import SigleChooseSlide from "./SigleChooseSlide";
import MultiChooseSlide from "./MultiChooseSlide";
import SigleSliderSlide from "./SigleSliderSlide";
import RangeSlideSlide from "./RangeSlideSlide";
import SigleInputSlide from "./SigleInputSlide";
import RatingSlide from "./RatingSlide";
import RakingSlide from "./RakingSlide";
import { handleSetIsValid, handleUpdateSpeechText } from "../../../app/appSlice";

type Props = {
    currentQuestionId: number;
};

const Slide = ({ currentQuestionId }: Props) => {
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);
    const dispatch = useAppDispatch();
    
    const data = useMemo(
        () =>
            (surveyData?.SurveyResponses || []).find(
                (i) => i.ValueJson.QuestionContent.Id === currentQuestionId
            ),
        [currentQuestionId, surveyData?.SurveyResponses]
    );
    const [timer, setTimer] = useState(-1);
    const refAudio = useRef<SpeechRecognition | null>(null);
    const [isActiveAudio, setIsActiveAudio] = useState<boolean>(false);
    const [isTimerInitialized, setIsTimerInitialized] = useState(false);
    const [inputText, setInputText] = useState<string>('');
    
    useEffect(() => {
        setInputText((data?.ValueJson.QuestionContent as any)?.SpeechText || '');
        dispatch(handleSetIsValid(true));
        const timeLimit = (data?.ValueJson.QuestionContent as any)?.TimeLimit || 0;
        setTimer(timeLimit);
        setIsTimerInitialized(true);
    },[currentQuestionId])

    const isValid = useAppSelector(state => state.appSlice.isValid)

    useEffect(() => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        refAudio.current = recognition;
        recognition.continuous = false;
        recognition.lang = 'vi';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event: any) {
            setIsActiveAudio(false);
            setInputText(event.results[0][0].transcript);
        };

        recognition.onspeechend = function () {
            recognition.stop();
        };
        recognition.onspeechend = function (e: any) {
            console.log(e);
        };

        recognition.onerror = function (event : any) {
            console.log(event);
            console.log(event.error);
        };
    }, []);

    useEffect(() => {
        if(inputText) {
            dispatch(handleUpdateSpeechText({
                text:inputText,
                questionId:data?.ValueJson.QuestionContent.Id || 0
            }));
        }
    },[inputText])

    useEffect(() => {
        if(timer > 0 && isTimerInitialized) {
            const interval = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearTimeout(interval);
        } else if(timer === 0 && isTimerInitialized){
            setIsTimerInitialized(false);
            setTimer(-1);
            dispatch(handleSetIsValid(false));
        }   
    },[timer, isTimerInitialized])

    const handleToggleMicrophone = () => {
        if(isValid) {
            alert("Vui lòng trả lời câu hỏi trước khi sử dụng micro!")
            return;
        }
        
        if (!refAudio.current) return;
        
        if (isActiveAudio) {
            refAudio.current.stop();
            setIsActiveAudio(false);
        } else {
            refAudio.current.start();
            setIsActiveAudio(true);
        }
    };

    const handleRender = useCallback(() => {
        switch (data?.ValueJson.QuestionContent.QuestionTypeId) {
            case 1:
                return <SigleChooseSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 2:
                return <MultiChooseSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 3:
                return <SigleSliderSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 4:
                return <RangeSlideSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 5:
                return <SigleInputSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 6:
                return <RatingSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            case 7:
                return <RakingSlide data={{
                    ...data,
                    ValueJson:{
                        ...data?.ValueJson,
                        QuestionContent:{
                            ...data?.ValueJson.QuestionContent,
                            SpeechText:inputText
                        }
                    }
                }} />;
            default:
                return <div className="">Chưa chọn type</div>;
        }
    }, [data]);

    return (
        <div className="">
            {/* Timer overlay - chỉ hiển thị khi timer > 0 */}
            {timer > 0 && (data?.ValueJson?.QuestionContent as any)?.IsVoice && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                            <div className="text-center">
                                <div className="text-sm font-medium opacity-90">Có thể trả lời sau {timer}s</div>
                                <div className="text-2xl font-bold">{timer}s</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="">
                <div className="mb-[20px]">
                    <p className="text-center text-[28px]">
                        {data?.ValueJson?.QuestionContent?.Content || ""}
                    </p>
                    <p className="text-center text-[20px]">
                        {data?.ValueJson?.QuestionContent?.Description || ""}
                    </p>
                </div>
            </div>
            
            {/* Microphone Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={handleToggleMicrophone}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActiveAudio 
                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                            : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50'
                    }`}
                >
                    <svg 
                        className={`w-8 h-8 ${isActiveAudio ? 'text-white animate-pulse' : 'text-white'}`}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                </button>
            </div>
            
            {/* Display transcribed text */}
            {inputText && (data?.ValueJson?.QuestionContent as any)?.IsVoice && (
                <div className="text-center mb-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700 font-medium">Văn bản ghi âm:</p>
                    <p className="text-gray-900">{inputText}</p>
                </div>
            )}
            
            {handleRender()}
        </div>
    );
};

export default Slide;
