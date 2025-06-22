interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

import { useCallback, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { handleUpdateSigleChoose } from "../../../app/appSlice";
// import Error from "./Error";

const SigleChooseSlide = ({ data }: Props) => {
    const dispatch = useAppDispatch();
    const idSelected = useMemo(
        () => data?.ValueJson?.QuestionResponse?.SingleChoice || 0,
        [data]
    );
    // const isValid = useMemo(() => data?.IsValid, [data]);

    const handleSelect = useCallback(
        (id: number) => {
            dispatch(
                handleUpdateSigleChoose({
                    idChoose: id,
                    questionId: data?.ValueJson?.QuestionContent?.Id || 0,
                })
            );
        },
        [data?.ValueJson?.QuestionContent?.Id, dispatch]
    );

    return (
        <div className="flex flex-col gap-4 w-[90%] max-w-5xl mx-auto mt-6">
            {/* {!isValid ? (
                <Error message="Câu hỏi này chưa được trả lời" />
            ) : null} */}
            {(data?.ValueJson?.QuestionContent?.Options || []).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (op: any) => (
                    <button
                        key={op?.Id}
                        onClick={() =>
                            idSelected === op?.Id
                                ? null
                                : handleSelect(op?.Id || 0)
                        }
                        className={`text-left px-5 py-2 rounded transition-all duration-150 font-medium text-lg
                        ${
                            idSelected === op?.Id
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

export default SigleChooseSlide;
