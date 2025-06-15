import { useEffect } from "react";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OptionType, QuestionType } from "../../../types/survey";
/* eslint-enable @typescript-eslint/no-unused-vars */
import ButtonAddAnswer from "../../molecules/buttons/ButtonAddAnswer";
import "./styles.scss";
import { answerDefault } from "../../../constants/question";
import Answer from "../../molecules/answer/Answer";

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

const Ranking = ({ question, handleUpdateQuestion }: Props) => {
    useEffect(() => {
        if (!question?.Options?.length) {
            handleUpdateQuestion("Options", [{ ...answerDefault, Order: 1 }]);
        }
    }, [question, handleUpdateQuestion]);

    const handleUpdateOption = (updatedOption: OptionType) => {
        const updatedOptions = (question?.Options || []).map((option) =>
            option.Order === updatedOption.Order ? updatedOption : option
        );
        handleUpdateQuestion("Options", updatedOptions);
    };

    const handleDeleteOption = (orderToDelete: number) => {
        const updatedOptions = (question?.Options || []).filter(
            (option) => option.Order !== orderToDelete
        );

        handleUpdateQuestion("Options", updatedOptions);
    };

    const handleAddAnswer = () => {
        const newOrder = question?.Options?.length
            ? Math.max(...question.Options.map((o) => o.Order)) + 1
            : 1;
        const newOption = { ...answerDefault, Order: newOrder };
        const updatedOptions = [...(question?.Options || []), newOption];
        handleUpdateQuestion("Options", updatedOptions);
    };

    return (
        <div className="ranking flex flex-col gap-2">
            {question?.Options?.length
                ? question.Options.map((item) => {
                      return (
                          <Answer
                              data={item}
                              key={item.Order}
                              handleUpdateOption={handleUpdateOption}
                              handleDeleteOption={handleDeleteOption}
                              isDisableClose={false}
                              formData={{
                                  Id: 0,
                                  RequesterId: 0,
                                  Title: "",
                                  Description: "",
                                  MarketSurveyVersionStatusId: 1,
                                  SurveyTypeId: 0,
                                  SurveyTopicId: 0,
                                  SurveySpecificTopicId: 0,
                                  SurveyStatusId: 0,
                                  SecurityModeId: 0,
                                  Background: "",
                                  ConfigJson: {
                                      BackgroundGradient1Color: "",
                                      BackgroundGradient2Color: "",
                                      TitleColor: "",
                                      ContentColor: "",
                                      ButtonBackgroundColor: "",
                                      ButtonContentColor: "",
                                      Password: "",
                                      Brightness: 0,
                                  },
                                  Questions: [],
                                  SkipStartPage: false,
                              }}
                          />
                      );
                  })
                : null}
            <ButtonAddAnswer onClick={handleAddAnswer} />
        </div>
    );
};

export default Ranking;
