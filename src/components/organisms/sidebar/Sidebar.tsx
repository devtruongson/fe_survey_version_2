/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuItem, Select } from "@mui/material";
import { useMemo } from "react";
import { SurveyQuestionType } from "../../../constants/question";
import type {
    OptionType,
    QuestionType,
    SurveyType,
} from "../../../types/survey";
import TimeLimit from "../../molecules/time-limit/TimeLimit";
import Voice from "../../molecules/voice/Voice";
import LogicComponent from "../QuestionPage/components/ModalLogic";
import LogicComponentDisplay from "../QuestionPage/components/ModalLogicDisplay";
import SwitchCustomize from "../QuestionPage/components/SwitchCustomize";
import type { RangeSliderConfigJsonType } from "../RangeSlider/RangeSlider";

const Sidebar = ({
    question,
    formData,
    setFormData,
    handleUpdateQuestion,
    listComponent,
}: {
    question: QuestionType;
    formData: SurveyType;
    setFormData: React.Dispatch<React.SetStateAction<SurveyType>>;
    handleUpdateQuestion: (
        key: keyof QuestionType,
        value:
            | string
            | number
            | boolean
            | OptionType[]
            | Record<string, string | number>
            | RangeSliderConfigJsonType
            | Record<string, unknown>
    ) => void;
    listComponent: any;
}) => {
    const handleChangeType = (type: number) => {
        handleUpdateQuestion("QuestionTypeId", type);
        handleUpdateQuestion("ConfigJson", {});
        if (question?.Options?.length) {
            handleUpdateQuestion("Options", []);
        }
    };

    // const isBasic = useMemo(() => formData?.SecurityModeId === 1, [formData]);
    const isAdvance = useMemo(() => formData?.SecurityModeId === 2, [formData]);
    const isPro = useMemo(() => formData?.SecurityModeId === 3, [formData]);
    return (
        <>
            <p>Chọn loại câu hỏi</p>
            <Select
                value={question?.QuestionTypeId || 0}
                onChange={(e) => handleChangeType(e.target.value)}
                label="Chọn loại câu hỏi"
                className="mb-2"
            >
                {SurveyQuestionType?.map((item) => {
                    return (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    );
                })}
            </Select>
            <SwitchCustomize
                type="RequiredAnswer"
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
                label="Bắt buộc câu trả lời"
            />
            <SwitchCustomize
                type="IsUseLabel"
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
                label="Gắn nhãn ở đầu câu hỏi"
            />
            <SwitchCustomize
                type="ImageEndQuestion"
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
                label="Hình ảnh/Video ở đầu câu hỏi"
            />

            <Voice
                label="Sử dụng Voice"
                isPro={isPro}
                setFormData={setFormData}
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
            />
            {listComponent &&
                listComponent.map((Item: any) => {
                    return Item.children;
                })}

            {formData?.SurveyTypeId === 3 ||
            formData?.SecurityModeId === 1 ? null : (
                <>
                    <LogicComponent
                        questions={formData?.Questions || []}
                        question={question}
                        handleUpdateQuestion={handleUpdateQuestion}
                    />
                    <LogicComponentDisplay
                        questions={formData?.Questions || []}
                        question={question}
                        handleUpdateQuestion={handleUpdateQuestion}
                    />
                </>
            )}
            <SwitchCustomize
                type="NotBack"
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
                label="Không cho quay lại câu trước"
            />
            <SwitchCustomize
                type="ViewNumberQuestion"
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
                label="Hiện số thứ tự gốc của câu trả lời"
            />
            <TimeLimit
                isAdvance={isAdvance}
                setFormData={setFormData}
                question={question}
                handleUpdateQuestion={handleUpdateQuestion}
            />
        </>
    );
};

export default Sidebar;
