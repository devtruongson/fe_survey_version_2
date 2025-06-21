import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Button, Tab } from "@mui/material";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { SweetAlertResult } from "sweetalert2";
import Swal from "sweetalert2";
import { HEADER_HEIGHT } from "../../../constants";
import useBlocker from "../../../hooks/useBlocker";
import { useGetSurvey } from "../../../services/survey/get";
import { useUpdateSurvey } from "../../../services/survey/update";
import type { SurveyType } from "../../../types/survey";
import CompletePage from "../../organisms/CompletePage/CompletePage";
import EndPage from "../../organisms/EndPage/EndPage";
import OverlayDisable from "../../organisms/overlay/OverlayDisable";
import QuestionPage from "../../organisms/QuestionPage/QuestionPage";
import ReportPage from "../../organisms/ReportPage/ReportPage";
import SharePage from "../../organisms/SharePage/SharePage";
import StartPage from "../../organisms/StartPage/StartPage";
import MainTemPlate from "../../templates/MainTemPlate";
import "./styles.scss";

const defaultValue = {
    Id: 999,
    RequesterId: 10,
    Title: "",
    Description: "",
    MarketSurveyVersionStatusId: 2, // SurveyStatusId: 3
    SurveyTypeId: 2,
    SurveyTopicId: 2,
    SurveySpecificTopicId: 5,
    SurveyStatusId: 1, //
    SecurityModeId: 1,
    BackgroundImageBase64: "",
    ConfigJson: {
        Background: "image",
        IsUseBackgroundImageBase64: false,
        IsPause: false,
        BackgroundGradient1Color: "#ffffff",
        BackgroundGradient2Color: "#f0f0f0",
        TitleColor: "#000000",
        ContentColor: "#333333",
        ButtonBackgroundColor: "#007bff",
        ButtonContentColor: "#ffffff",
        Password: "123456",
        Brightness: 100,
        DefaultBackgroundImageId: 1,
        SkipStartPage: false,
    },
    Questions: [],
};

const SurveyNew = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<SurveyType>(defaultValue);
    const [isSaving, setIsSaving] = useState(false);
    const [saveCountdown, setSaveCountdown] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const latestDataRef = useRef(formData);
    const timeoutRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);

    const isTrigger = useMemo(() => formData?.SurveyStatusId !== 2, [formData]);

    const { data } = useGetSurvey({ id: Number(id) || 0 });

    const handleTabClick = (tabValue: number) => {
        setActiveTab(tabValue);
    };

    const tabs = [
        {
            label: "Trang Bắt Đầu",
            value: 0,
            component: (
                <StartPage
                    // isTrigger={isTrigger}
                    formData={formData}
                    setFormData={setFormData}
                    handleTabClick={handleTabClick}
                    isDisable={isDisable}
                />
            ),
        },
        {
            label: "Bảng Hỏi",
            value: 1,
            component: (
                <QuestionPage
                    formData={formData}
                    setFormData={setFormData}
                    // isTrigger={isTrigger}
                />
            ),
        },
        {
            label: "Trang Kết Thúc",
            value: 2,
            component: <EndPage formData={formData} />,
        },
        {
            label: "Hoàn Tất",
            value: 3,
            component: <CompletePage formData={formData} />,
        },
        {
            label: "Chia Sẻ",
            value: 4,
            component: <SharePage formData={formData} />,
        },
        {
            label: "Báo cáo",
            value: 5,
            component: <ReportPage />,
            disabled: true,
        },
    ];

    const ActiveComponent = tabs[activeTab].component;

    const { mutate } = useUpdateSurvey({
        mutationConfig: {
            onSuccess(newData) {
                setFormData(newData.data);
                latestDataRef.current = newData.data;
                setIsDisable(newData?.data?.ConfigJson?.IsPause);
                if (!id) {
                    window.history.pushState(
                        {},
                        "",
                        `/survey/update/${newData.data.Id}`
                    );
                }
            },
        },
    });

    const handleConfirm = () => {
        if (isDisable) return;
        Swal.fire({
            title: "Bạn muốn lưu các thay đổi?",
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((result: SweetAlertResult) => {
            if (result.isConfirmed) {
                mutate({
                    ...latestDataRef.current,
                    ...formData,
                    type: "update",
                });
            }
        });
    };

    const handleSave = () => {
        if (isDisable) return;
        setIsSaving(true);
        setHasChanges(false);
        let seconds = 5;
        setSaveCountdown(seconds);

        countdownRef.current = setInterval(() => {
            seconds--;
            setSaveCountdown(seconds);
            if (seconds <= 0 && countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        }, 1000);

        timeoutRef.current = setTimeout(() => {
            mutate({ ...latestDataRef.current, type: "update" });
            setIsSaving(false);
            timeoutRef.current = null;
            countdownRef.current = null;
        }, 5000);
    };

    useEffect(() => {
        if (!id || !data) return;
        setFormData(data.data);
        setIsDisable(data?.data?.IsPause);
        latestDataRef.current = data.data;
    }, [id, data]);

    useEffect(() => {
        if (!isTrigger) return;

        if (!isEqual(latestDataRef.current, formData)) {
            latestDataRef.current = formData;
            setHasChanges(true);
            if (!timeoutRef.current) {
                handleSave();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // useEffect(() => {
    //     // if (!isDisable) return;

    //     window.addEventListener("keydown", (e) => {
    //         e.preventDefault();
    //     });

    //     return () => {
    //         window.removeEventListener("keydown", (e) => {
    //             e.preventDefault();
    //         });
    //     };
    // }, []);

    useBlocker(true);

    return (
        <MainTemPlate>
            {isDisable && <OverlayDisable />}
            <div
                style={{
                    maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
                    overflow: "hidden",
                }}
                className={`flex flex-col`}
            >
                <div className="survey-header">
                    <div className="survey-tabs">
                        {tabs.map((tab, index) => (
                            <div key={tab.value} className="tab-item">
                                <Tab
                                    label={tab.label}
                                    disabled={tab.disabled}
                                    className={
                                        activeTab === tab.value
                                            ? "tab-active"
                                            : "tab-inactive"
                                    }
                                    onClick={() =>
                                        !tab.disabled &&
                                        handleTabClick(tab.value)
                                    }
                                />
                                {index < tabs.length - 1 && (
                                    <NavigateNextIcon
                                        className="tab-separator"
                                        fontSize="small"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="survey-actions">
                        <Button
                            variant="text"
                            className="btn-save"
                            onClick={() => (isTrigger ? null : handleConfirm())}
                            sx={{
                                ...(hasChanges &&
                                    !isSaving && {
                                        backgroundColor: "#cccccc",
                                        color: "#000000",
                                        "&:hover": {
                                            backgroundColor: "#bbbbbb",
                                        },
                                    }),
                            }}
                        >
                            {isTrigger
                                ? isSaving
                                    ? `Đang lưu ... ${saveCountdown}`
                                    : hasChanges
                                    ? "Đã Lưu"
                                    : "Đã lưu"
                                : "Lưu"}
                        </Button>
                    </div>
                </div>
                <div
                    className="survey-content"
                    style={{
                        height: `calc(100vh - ${HEADER_HEIGHT}px - 60px)`,
                        overflow: "auto",
                    }}
                >
                    {ActiveComponent}
                </div>
            </div>
        </MainTemPlate>
    );
};

export default SurveyNew;
