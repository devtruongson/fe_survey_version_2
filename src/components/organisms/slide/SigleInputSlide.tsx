import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateForm } from "../../../app/appSlice";
import { Box, TextField } from "@mui/material";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const SigleInputSlide = ({ data }: Props) => {
    console.log(data);
    const dispatch = useDispatch();

    const handleRender = useCallback(() => {
        switch (
            data?.ValueJson?.QuestionContent?.ConfigJson?.FieldInputTypeId
        ) {
            case 1:
                return (
                    <input
                        type="text"
                        placeholder="Vui lòng nhập tại đây"
                        className="text-input"
                        value={
                            data?.ValueJson?.QuestionResponse?.Input?.Value ||
                            ""
                        }
                        onChange={(e) =>
                            dispatch(
                                handleUpdateForm({
                                    idChoose:
                                        data?.ValueJson?.QuestionContent?.Id,
                                    type: 1,
                                    value: e.target.value || "",
                                })
                            )
                        }
                    />
                );
            case 2:
                return (
                    <Box className="text-area w-full">
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Vui lòng nhập tại đây"
                            variant="outlined"
                            size="small"
                            value={
                                data?.ValueJson?.QuestionResponse?.SpeechText ||
                                ""
                            }
                            onChange={(e) =>
                                dispatch(
                                    handleUpdateForm({
                                        idChoose:
                                            data?.ValueJson?.QuestionContent
                                                ?.Id,
                                        type: 2,
                                        value: e.target.value || "",
                                    })
                                )
                            }
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box className="email-input w-full">
                        <TextField
                            fullWidth
                            placeholder="Nhập email tại đây"
                            variant="outlined"
                            size="small"
                            type="email"
                            value={
                                data?.ValueJson?.QuestionResponse?.Input
                                    ?.Value || ""
                            }
                            onChange={(e) =>
                                dispatch(
                                    handleUpdateForm({
                                        idChoose:
                                            data?.ValueJson?.QuestionContent
                                                ?.Id,
                                        type: 3,
                                        value: e.target.value || "",
                                    })
                                )
                            }
                        />
                    </Box>
                );
            case 4:
                return (
                    <Box className="number-input w-full">
                        <TextField
                            fullWidth
                            placeholder="Vui lòng nhập số"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={
                                data?.ValueJson?.QuestionResponse?.Input
                                    ?.Value || ""
                            }
                            onChange={(e) =>
                                dispatch(
                                    handleUpdateForm({
                                        idChoose:
                                            data?.ValueJson?.QuestionContent
                                                ?.Id,
                                        type: 4,
                                        value: e.target.value || "",
                                    })
                                )
                            }
                        />
                    </Box>
                );
            case 5:
                return;
            case 6:
                return;
            case 7:
                return;
            case 8:
                return;
            case 9:
                return;
            default:
                return <div className="">Chưa chọn type</div>;
        }
    }, [data]);
    return <div className="">{handleRender()}</div>;
};

export default SigleInputSlide;
