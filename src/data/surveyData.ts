export const SurveyTopic = [
    { "id": 1, "name": "Ẩm thực" },
    { "id": 2, "name": "Giáo dục" },
    { "id": 3, "name": "Sức khỏe & Thể dục" },
    { "id": 4, "name": "Công nghệ" },
    { "id": 5, "name": "Tài chính cá nhân" },
    { "id": 6, "name": "Mua sắm & Thương mại" },
    { "id": 7, "name": "Du lịch & Giải trí" },
    { "id": 8, "name": "Xã hội & Hành vi" },
    { "id": 9, "name": "Môi trường" },
    { "id": 10, "name": "Chính trị & Pháp luật" }
];

export const SurveySpecificTopic = [
    { "id": 1, "name": "Món ăn yêu thích", "SurveyTopicId": 1 },
    { "id": 2, "name": "Thói quen ăn uống", "SurveyTopicId": 1 },
    { "id": 3, "name": "Chế độ ăn kiêng", "SurveyTopicId": 1 },
    { "id": 4, "name": "Chất lượng giáo dục", "SurveyTopicId": 2 },
    { "id": 5, "name": "Học trực tuyến", "SurveyTopicId": 2 },
    { "id": 6, "name": "Hành vi học tập", "SurveyTopicId": 2 },
    { "id": 7, "name": "Thói quen tập luyện", "SurveyTopicId": 3 },
    { "id": 8, "name": "Sức khỏe tinh thần", "SurveyTopicId": 3 },
    { "id": 9, "name": "Chế độ sinh hoạt", "SurveyTopicId": 3 },
    { "id": 10, "name": "Thiết bị thông minh", "SurveyTopicId": 4 },
    { "id": 11, "name": "Ứng dụng di động", "SurveyTopicId": 4 },
    { "id": 12, "name": "Trí tuệ nhân tạo", "SurveyTopicId": 4 },
    { "id": 13, "name": "Chi tiêu cá nhân", "SurveyTopicId": 5 },
    { "id": 14, "name": "Đầu tư nhỏ lẻ", "SurveyTopicId": 5 },
    { "id": 15, "name": "Quản lý nợ", "SurveyTopicId": 5 },
    { "id": 16, "name": "Trải nghiệm mua sắm online", "SurveyTopicId": 6 },
    { "id": 17, "name": "Thói quen tiêu dùng", "SurveyTopicId": 6 },
    { "id": 18, "name": "So sánh giá cả", "SurveyTopicId": 6 },
    { "id": 19, "name": "Kế hoạch du lịch", "SurveyTopicId": 7 },
    { "id": 20, "name": "Phương tiện di chuyển", "SurveyTopicId": 7 },
    { "id": 21, "name": "Địa điểm yêu thích", "SurveyTopicId": 7 },
    { "id": 22, "name": "Mạng xã hội", "SurveyTopicId": 8 },
    { "id": 23, "name": "Thói quen sử dụng điện thoại", "SurveyTopicId": 8 },
    { "id": 24, "name": "Tâm lý người tiêu dùng", "SurveyTopicId": 8 },
    { "id": 25, "name": "Bảo vệ môi trường", "SurveyTopicId": 9 },
    { "id": 26, "name": "Tái chế và rác thải", "SurveyTopicId": 9 },
    { "id": 27, "name": "Biến đổi khí hậu", "SurveyTopicId": 9 },
    { "id": 28, "name": "Nhận thức chính trị", "SurveyTopicId": 10 },
    { "id": 29, "name": "Tham gia bầu cử", "SurveyTopicId": 10 },
    { "id": 30, "name": "Luật pháp và quyền công dân", "SurveyTopicId": 10 }
];

export const SurveySecurityMode = [
    {
        id: 1,
        name: "Basic",
        description: "6 loại câu hỏi để bạn tha hồ tùy chỉnh khảo sát. Random captcha giữa những câu hỏi. Random Re-question câu hỏi bất kỳ cho bài khảo sát. Random Time-limit cho câu hỏi"
    },
    {
        id: 2,
        name: "Advance",
        description: "6 loại câu hỏi để bạn tha hồ tùy chỉnh khảo sát. Random captcha giữa những câu hỏi. Random Re-question câu hỏi bất kỳ cho bài khảo sát. Chủ động điều chỉnh Time-limit cho từng câu hỏi. Cơ chế Jump Logic giúp khảo sát được liền mạch và chắt lọc thông tin hơn."
    },
    {
        id: 3,
        name: "Pro",
        description: "6 loại câu hỏi để bạn tha hồ tùy chỉnh khảo sát. Random captcha giữa những câu hỏi. Random Re-question câu hỏi bất kỳ cho bài khảo sát. Chủ động điều chỉnh Time-limit cho từng câu hỏi. Cơ chế Jump Logic giúp khảo sát được liền mạch và chắt lọc thông tin hơn. Tính năng set voice-answer cho câu hỏi"
    }
];