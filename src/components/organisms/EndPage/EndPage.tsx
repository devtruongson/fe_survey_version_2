import type { SurveyType } from "../../../types/survey";
import "./styles.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routesMap } from "../../../routes/routes";

type Props = {
    formData: SurveyType;
};

const EndPage = ({ formData }: Props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listBackground, setListBackground] = useState<any[]>([]);

    const handleNavigate = useCallback(() => {
        // console.log("run >>>>", id);
        if (id) {
            navigate(routesMap.SurveyCustomer.replace("/:id", `/${id}`));
        }
    }, [id, navigate]);

    useEffect(() => {
        setListBackground(
            JSON.parse(localStorage.getItem("listBackground") || "[]")
        );
    }, []);

    return (
        <div
            className="min-h-[100%] question-main flex-1 flex flex-col overflow-y-auto relative items-center justify-center"
            style={{
                ...(formData?.Background === "image" && {
                    backgroundImage: `url(${
                        formData?.IsUseBackgroundImageBase64 &&
                        formData.BackgroundImageBase64
                            ? formData.BackgroundImageBase64
                            : formData?.ConfigJson?.DefaultBackgroundImageId
                            ? listBackground.find(
                                  (item) =>
                                      item.id ===
                                      formData?.ConfigJson
                                          ?.DefaultBackgroundImageId
                              )?.url
                            : ""
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: `Brightness(${
                        formData.ConfigJson.Brightness / 100
                    })`,
                    backgroundColor: "transparent",
                }),
                ...(formData.Background === "color_gradient" && {
                    background: `linear-gradient(to right, ${formData.ConfigJson.BackgroundGradient1Color}, ${formData.ConfigJson.BackgroundGradient2Color})`,
                    filter: `Brightness(${
                        formData.ConfigJson.Brightness / 100
                    })`,
                }),
                ...(formData.Background?.startsWith("#") && {
                    backgroundColor: formData.Background,
                    filter: `Brightness(${
                        formData.ConfigJson.Brightness / 100
                    })`,
                }),
            }}
        >
            <Box className="flex flex-col items-center space-y-4">
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: "50%",
                        width: "80px",
                        height: "80px",
                        minWidth: "unset",
                        backgroundColor: "white",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                    onClick={handleNavigate}
                >
                    <PlayArrowIcon sx={{ fontSize: 50, color: "black" }} />
                </Button>
                <Typography variant="h6" sx={{ color: "white" }}>
                    Chạy thử khảo sát
                </Typography>
            </Box>
        </div>
    );
};

export default EndPage;
