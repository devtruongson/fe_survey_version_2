/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateRaking } from "../../../app/appSlice";
import type { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/hooks";
import { HiddenCheck } from "../../molecules/hiddenCheck/HiddenCheck";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const RakingSlide = ({ data }: Props) => {
    const dispatch = useDispatch();
    const config = useAppSelector((state) => state.appSlice.infoSurvey);

    const questionId = data?.ValueJson?.QuestionContent?.Id;

    const ranking: { SurveyOptionId: number; RankIndex: number }[] =
        useSelector(
            (state: RootState) =>
                (
                    state.appSlice.surveyData?.SurveyResponses.find(
                        (r) => r.ValueJson.QuestionContent.Id === questionId
                    )?.ValueJson.QuestionResponse as any
                )?.Ranking || []
        );

    const options = data?.ValueJson?.QuestionContent?.Options || [];

    const handleRank = (id: number, content: string) => {
        const idx = ranking.findIndex((r) => r.SurveyOptionId === id);
        let newRanking;
        if (idx > -1) {
            newRanking = ranking.filter((r) => r.SurveyOptionId !== id);
        } else {
            newRanking = [
                ...ranking,
                {
                    SurveyOptionId: id,
                    RankIndex: ranking.length + 1,
                    Content: content,
                },
            ];
        }
        newRanking = newRanking.map((r, i) => ({
            SurveyOptionId: r.SurveyOptionId,
            RankIndex: i + 1,
        }));
        dispatch(
            handleUpdateRaking({
                idChoose: questionId,
                ranking: newRanking,
            })
        );
    };

    const selectedMap = Object.fromEntries(
        (ranking || []).map((r) => [r.SurveyOptionId, r.RankIndex])
    );

    return (
        <div className="flex flex-col gap-4 w-[90%] max-w-5xl mx-auto mt-6">
            {options.map((op: any) => (
                <div className="flex justify-center items-center gap-5 w-[100%]">
                    {op?.MainImageUrl ? (
                        <img
                            alt="image"
                            src={op?.MainImageUrl}
                            className="w-[100px] object-contain"
                        />
                    ) : null}

                    <button
                        key={op.Id}
                        onClick={() => handleRank(op.Id, op.Content)}
                        className={`text-left px-5 py-2 rounded transition-all duration-150 font-medium text-lg flex items-center flex-1
                        ${
                            selectedMap[op.Id]
                                ? "bg-[#24738a] text-white"
                                : "bg-transparent text-white border border-white"
                        }
                    `}
                        style={{
                            color: config?.ConfigJson?.ContentColor || "#000",
                        }}
                    >
                        {selectedMap[op.Id] && (
                            <span className="mr-3 font-bold">
                                #{selectedMap[op.Id]}
                            </span>
                        )}
                        {op.Content}
                    </button>
                </div>
            ))}
            <HiddenCheck id={data?.ValueJson.QuestionContent.QuestionTypeId} />;
        </div>
    );
};

export default RakingSlide;
