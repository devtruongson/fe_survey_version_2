import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import SigleChooseSlide from "./SigleChooseSlide";
import MultiChooseSlide from "./MultiChooseSlide";
import SigleSliderSlide from "./SigleSliderSlide";
import RangeSlideSlide from "./RangeSlideSlide";
import SigleInputSlide from "./SigleInputSlide";
import RatingSlide from "./RatingSlide";
import RakingSlide from "./RakingSlide";

type Props = {
    currentQuestionId: number;
};

const Slide = ({ currentQuestionId }: Props) => {
    const surveyData = useAppSelector((state) => state.appSlice.surveyData);
    const data = useMemo(
        () =>
            (surveyData?.SurveyResponses || []).find(
                (i) => i.ValueJson.QuestionContent.Id === currentQuestionId
            ),
        [currentQuestionId, surveyData?.SurveyResponses]
    );

    console.log("data >>>> ", data);

    const handleRender = useCallback(() => {
        switch (data?.ValueJson.QuestionContent.QuestionTypeId) {
            case 1:
                return <SigleChooseSlide data={data} />;
            case 2:
                return <MultiChooseSlide data={data} />;
            case 3:
                return <SigleSliderSlide data={data} />;
            case 4:
                return <RangeSlideSlide data={data} />;
            case 5:
                return <SigleInputSlide />;
            case 6:
                return <RatingSlide />;
            case 7:
                return <RakingSlide />;
            default:
                return <div className="">Chưa chọn type</div>;
        }
    }, [data]);

    return (
        <div className="">
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
            {handleRender()}
        </div>
    );
};

export default Slide;
