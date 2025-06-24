import { Box, Slider, Typography } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { handleChangeRangeSlide } from "../../../app/appSlice";
import { useAppSelector } from "../../../app/hooks";
import { HiddenCheck } from "../../molecules/hiddenCheck/HiddenCheck";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const RangeSlideSlide = ({ data }: Props) => {
    const config = useAppSelector((state) => state.appSlice.infoSurvey);

    const value = useMemo(
        () => [
            data?.ValueJson?.QuestionResponse?.Range?.Min ||
                data?.ValueJson?.QuestionContent?.ConfigJson?.Min ||
                0,
            data?.ValueJson?.QuestionResponse?.Range?.Max ||
                data?.ValueJson?.QuestionContent?.ConfigJson?.Max ||
                10,
        ],
        [data]
    );
    const min = useMemo(
        () => data?.ValueJson?.QuestionContent?.ConfigJson?.Min,
        [data]
    );
    const max = useMemo(
        () => data?.ValueJson?.QuestionContent?.ConfigJson?.Max,
        [data]
    );
    const step = useMemo(
        () => data?.ValueJson?.QuestionContent?.ConfigJson?.Step,
        [data]
    );
    const dispatch = useDispatch();
    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            dispatch(
                handleChangeRangeSlide({
                    idChoose: data?.ValueJson?.QuestionContent?.Id,
                    min: newValue[0],
                    max: newValue[1],
                })
            );
        }
    };
    return (
        <Box className="single-slider p-6 rounded-lg flex flex-col gap-6">
            <Box className="flex flex-col items-center w-full">
                <Box className="flex justify-between w-full px-1 mb-2">
                    <Typography variant="body2" color="white">
                        {min}
                    </Typography>
                    <Typography variant="body2" color="white">
                        {max}
                    </Typography>
                </Box>
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    aria-labelledby="range-slider"
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    step={step}
                    sx={{
                        "& .MuiSlider-thumb": {
                            backgroundColor: config?.ConfigJson
                                ?.ButtonBackgroundColor
                                ? config?.ConfigJson?.ButtonBackgroundColor
                                : "#000",
                            borderRadius: 0,
                            width: 26,
                            height: 26,
                            "&:focus, &:hover, &.Mui-active": {
                                boxShadow: "inherit",
                            },
                        },
                    }}
                />
            </Box>

            <HiddenCheck id={data?.ValueJson.QuestionContent.QuestionTypeId} />
        </Box>
    );
};

export default RangeSlideSlide;
