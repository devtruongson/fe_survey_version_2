import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { OptionType, SurveyType } from "../../../types/survey";
import "./styles.scss";

type Props = {
    data: OptionType;
    handleUpdateOption: (updatedOption: OptionType) => void;
    handleDeleteOption: (orderToDelete: number) => void;
    isDisableClose: boolean;
    formData: SurveyType;
};
const Answer = ({
    data,
    handleUpdateOption,
    handleDeleteOption,
    isDisableClose,
    formData,
}: Props) => {
    const [showImage, setShowImage] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleUpdateOption({ ...data, Content: event.target.value });
    };

    const handleDelete = () => {
        handleDeleteOption(data.Order);
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                handleUpdateOption({ ...data, Image: base64String });
                setShowImage(true); // Auto show image after upload
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleImage = () => {
        setShowImage(!showImage);
    };

    return (
        <div className="answer-container">
            <div className="flex items-center">
                <TextField
                    value={data.Content}
                    variant="outlined"
                    size="small"
                    className="answer-input flex-grow"
                    placeholder="Nhập câu trả lời tại đây"
                    onChange={handleChange}
                    style={{
                        color: `${formData?.ConfigJson?.ContentColor}`,
                    }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id={`image-upload-${data.Order}`}
                />
                <label htmlFor={`image-upload-${data.Order}`}>
                    <IconButton
                        size="small"
                        component="span"
                    >
                        <ImageIcon fontSize="small" />
                    </IconButton>
                </label>
                {data.Image && (
                    <IconButton
                        size="small"
                        onClick={toggleImage}
                        style={{ marginLeft: '4px' }}
                    >
                        {showImage ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                )}
                <IconButton
                    size="small"
                    onClick={handleDelete}
                    style={{
                        display: isDisableClose ? "none" : "block",
                    }}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className="settings-button !hidden">
                    <SettingsIcon fontSize="small" />
                </IconButton>
            </div>
            {data.Image && showImage && (
                <div className="mt-2" style={{ maxWidth: '300px' }}>
                    <img 
                        src={data.Image}
                        alt="Uploaded answer" 
                        style={{ 
                            width: '100%', 
                            height: 'auto',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default Answer;
