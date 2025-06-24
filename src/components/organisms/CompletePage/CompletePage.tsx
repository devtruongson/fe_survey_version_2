import type { SurveyType } from "../../../types/survey";
import "./styles.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";

type Props = {
    formData: SurveyType;
};

const getErrors = (formData: SurveyType): string[] => {
    const errors: string[] = [];
    if (formData?.Questions) {
        formData.Questions.forEach((question) => {
            if (!question.Content) {
                errors.push(`Câu hỏi ${question.Order} chưa điền tiêu đề`);
            }

            if (!question.QuestionTypeId) {
                errors.push(`Câu hỏi ${question.Order} chưa chọn loại câu hỏi`);
            }

            if (
                question.QuestionTypeId === 1 ||
                question.QuestionTypeId === 2 ||
                question.QuestionTypeId === 7
            ) {
                if (question.Options && question.Options.length > 0) {
                    question.Options.forEach((option, optionIndex) => {
                        if (!option.Content) {
                            errors.push(
                                `Câu hỏi ${question.Order}, Tùy chọn ${
                                    optionIndex + 1
                                } chưa điền nội dung`
                            );
                        }
                    });
                } else {
                    errors.push(
                        `Câu hỏi ${question.Order} (${
                            question.QuestionTypeId === 1
                                ? "Trắc nghiệm 1 lựa chọn"
                                : question.QuestionTypeId === 2
                                ? "Trắc nghiệm nhiều lựa chọn"
                                : "Xếp hạng"
                        }) cần có ít nhất một tùy chọn`
                    );
                }
            }
        });
    }
    return errors;
};

const CompletePage = ({ formData }: Props) => {
    const errors = getErrors(formData);

    return (
        <div
            className="complete-page flex-1 flex flex-col items-center justify-center min-h-[100%]"
            style={{
                ...(formData?.Background?.startsWith("/") && {
                    backgroundImage: `url(${formData?.Background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: `Brightness(${
                        formData?.ConfigJson?.Brightness / 100
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
            <Box className="flex flex-col items-center space-y-4 w-[100%]">
                {errors.length > 0 ? (
                    <Box className="flex flex-col space-y-2 p-4">
                        {errors.map((error, index) => (
                            <ErrorItem key={index} title={error} />
                        ))}
                    </Box>
                ) : (
                    <Box className="p-4">
                        <Typography variant="h4">Survey Completed!</Typography>
                        {formData.Title && (
                            <Typography variant="body1">
                                Survey Title: {formData.Title}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default CompletePage;

const ErrorItem = ({ title }: { title: string }) => {
    return (
        <Box className="bg-red-500 text-white p-3 flex items-center space-x-2 rounded w-[100%]">
            <WarningIcon fontSize="small" />
            <Typography variant="body2">{title}</Typography>
        </Box>
    );
};
