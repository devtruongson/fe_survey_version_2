import { Box, Slider, Typography } from "@mui/material";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const SigleSliderSlide = ({ data }: Props) => {
    return (
        <Box className="single-slider bg-gray-500 p-6 rounded-lg flex flex-col gap-6">
            <Box className="flex flex-col items-center w-full">
                <Box className="flex justify-between w-full px-1 mb-2">
                    <Typography variant="body2" color="white">
                        {0}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="white"
                        sx={{ flexGrow: 1, textAlign: "center" }}
                    >
                        {1}
                    </Typography>
                    <Typography variant="body2" color="white">
                        {20}
                    </Typography>
                </Box>
                <Slider
                    // value={value}
                    // onChange={handleSliderChange}
                    aria-labelledby="single-slider"
                    valueLabelDisplay="auto"
                    // min={min}
                    // max={max}
                    // step={step}
                    // sx={{
                    //     "& .MuiSlider-thumb": {
                    //         backgroundColor: formData?.ConfigJson
                    //             ?.ButtonBackgroundColor
                    //             ? formData?.ConfigJson
                    //                   ?.ButtonBackgroundColor
                    //             : "#000",
                    //         borderRadius: 0,
                    //         width: 26,
                    //         height: 26,
                    //         "&:focus, &:hover, &.Mui-active": {
                    //             boxShadow: "inherit",
                    //         },
                    //     },
                    // }}
                />
            </Box>
        </Box>
    );
};

export default SigleSliderSlide;
