import { useCallback, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import Error from "./Error";
import { handleUpdateMutilChoice } from "../../../app/appSlice";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const MultiChooseSlide = ({ data }: Props) => {
    const dispatch = useAppDispatch();
    const idsSelected = useMemo(
        () => data?.ValueJson?.QuestionResponse?.MultipleChoice || [],
        [data]
    );
    const isValid = useMemo(() => data?.IsValid, [data]);

    const handleSelect = useCallback(
        (id: number) => {
            dispatch(
                handleUpdateMutilChoice({
                    idChoose: id,
                    questionId: data?.ValueJson?.QuestionContent?.Id || 0,
                })
            );
        },
        [data?.ValueJson?.QuestionContent?.Id, dispatch]
    );

    console.log(idsSelected);

    return (
        <div className="flex flex-col gap-4 w-[90%] max-w-5xl mx-auto mt-6">
            {!isValid ? (
                <Error message="Câu hỏi này chưa được trả lời" />
            ) : null}
            {(data?.ValueJson?.QuestionContent?.Options || []).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (op: any) => (
                    <button
                        key={op?.Id}
                        onClick={() => handleSelect(op?.Id || 0)}
                        className={`text-left px-5 py-2 rounded transition-all duration-150 font-medium text-lg
                        ${
                            idsSelected.includes(op?.Id)
                                ? "bg-[#24738a] text-white border-none"
                                : "bg-transparent text-white border border-white"
                        }
                    `}
                    >
                        {op.Content}
                    </button>
                )
            )}
        </div>
    );
};

export default MultiChooseSlide;
