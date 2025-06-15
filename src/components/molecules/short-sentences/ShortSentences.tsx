import "./styles.scss";
import ButtonAddAnswer from "../buttons/ButtonAddAnswer";
import type { OptionType, QuestionType } from "../../../types/survey";
import { useCallback, useEffect } from "react";

type Props = {
    question: QuestionType;
    handleUpdateQuestion: (
        key: keyof QuestionType,
        value:
            | string
            | number
            | boolean
            | OptionType[]
            | Record<string, string | number>
    ) => void;
};
const optionDefault = {
    Order: 1,
    Content: "",
};
const ShortSentences = ({ question, handleUpdateQuestion }: Props) => {
    const handleAddOption = useCallback(() => {
        handleUpdateQuestion("Options", [
            ...question.Options,
            { ...optionDefault, Order: question.Options.length + 1 },
        ]);
    }, [handleUpdateQuestion, question.Options]);

    useEffect(() => {
        if (!question?.Options?.length) {
            handleUpdateQuestion("Options", [optionDefault]);
        }
    }, [handleUpdateQuestion, question]);
    return (
        <div className="short-sentences-container">
            {question?.Options?.length
                ? question.Options.map((_, index) => {
                      return (
                          <input
                              key={index}
                              type="text"
                              disabled
                              placeholder="Vui lòng nhập tại đây"
                              className="text-input"
                          />
                      );
                  })
                : null}
            <ButtonAddAnswer onClick={() => handleAddOption()} />{" "}
        </div>
    );
};

export default ShortSentences;
