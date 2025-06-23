import { useCallback, useMemo } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import CircleIcon from "@mui/icons-material/Circle";
import CheckIcon from "@mui/icons-material/Check";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { handleUpdateRating } from "../../../app/appSlice";
import { useAppSelector } from "../../../app/hooks";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const RatingSlide = ({ data }: Props) => {
    const config = useAppSelector((state) => state.appSlice.infoSurvey);

    const length = useMemo(
        () => data?.ValueJson?.QuestionContent?.ConfigJson?.RatingLength || 0,
        [data]
    );
    const selected = useMemo(
        () => data?.ValueJson?.QuestionResponse?.Input?.Value || 0,
        [data]
    );
    const dispatch = useDispatch();

    const handleRenderIcons = useCallback(
        (color: string) => {
            const type =
                data?.ValueJson?.QuestionContent?.ConfigJson?.RatingIcon || "";
            switch (type) {
                case "FavoriteIcon":
                    return (
                        <FavoriteIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "ThumbUpIcon":
                    return (
                        <ThumbUpIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "FreeBreakfastIcon":
                    return (
                        <FreeBreakfastIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "CircleIcon":
                    return (
                        <CircleIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "CheckIcon":
                    return (
                        <CheckIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "RocketLaunchIcon":
                    return (
                        <RocketLaunchIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                case "RadioButtonCheckedIcon":
                    return (
                        <RadioButtonCheckedIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
                default:
                    return (
                        <StarBorderIcon
                            fontSize="large"
                            className={`cursor-pointer ${color}`}
                        />
                    );
            }
        },
        [data]
    );

    const handleSelect = (index: number) => {
        dispatch(
            handleUpdateRating({
                idChoose: data?.ValueJson?.QuestionContent?.Id,
                value: index + 1,
            })
        );
    };

    return (
        <div className="">
            <Box className="flex space-x-4">
                {Array.from({ length: length }).map((_, index) => (
                    <Box
                        key={index}
                        className={`flex flex-col items-center cursor-pointer ${
                            selected === index + 1 ? "text-blue-600" : ""
                        }`}
                        onClick={() => handleSelect(index)}
                    >
                        {handleRenderIcons(
                            selected >= index + 1
                                ? "text-blue-600"
                                : "text-gray-700"
                        )}
                        <Typography
                            variant="body2"
                            className="text-gray-700 mt-1"
                        >
                            {index + 1}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default RatingSlide;
