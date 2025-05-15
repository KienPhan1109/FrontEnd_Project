let data = {
    users: [
        {
            id: 1,
            username: "kienphan",
            email: "phantrungkien2006@gmail.com",
            password: "Kien@1109AA.",
            created_at: "2025-02-28T12:00:00Z",
            boards: [
                {
                    id: 101,
                    title: "Dự án Website",
                    description: "Quản lý tiến độ dự án website",
                    backdrop: "../assets/images/board1.png",
                    is_starred: false,
                    is_closed: false,
                    created_at: "2025-02-28T12:30:00Z",
                    lists: [
                        {
                            id: 201,
                            title: "Việc cần làm",
                            created_at: "2025-02-28T13:00:00Z",
                            tasks: [
                                {
                                    id: 301,
                                    title: "Thiết kế giao diện",
                                    description: "Tạo wireframe cho trang chủ",
                                    status: "pending",
                                    due_date: "2025-03-05T23:59:59Z",
                                    tag: [
                                        {
                                            id: 401,
                                            content: "Urgent",
                                            color: "#fff",
                                        },
                                    ],
                                    created_at: "2025-02-28T13:30:00Z",
                                },
                                {
                                    id: 302,
                                    title: "Làm chức năng",
                                    description: "Chức năng thêm sửa xóa",
                                    status: "pending",
                                    due_date: "2025-03-05T23:59:59Z",
                                    tag: [
                                        {
                                            id: 401,
                                            content: "Urgent",
                                            color: "#fff",
                                        },
                                    ],
                                    created_at: "2025-02-28T13:30:00Z",
                                },
                                {
                                    id: 303,
                                    title: "Kiểm thử và fix bug",
                                    description: "...",
                                    status: "pending",
                                    due_date: "2025-03-05T23:59:59Z",
                                    tag: [
                                        {
                                            id: 401,
                                            content: "Urgent",
                                            color: "#fff",
                                        },
                                    ],
                                    created_at: "2025-02-28T13:30:00Z",
                                },
                            ],
                        },
                        {
                            id: 202,
                            title: "Việc đã làm",
                            created_at: "2025-02-28T13:00:00Z",
                            tasks: [],
                        },
                    ],
                },
                {
                    id: 102,
                    title: "Dự án Mobile App",
                    description: "Quản lý tiến độ mobile app",
                    backdrop: "../assets/images/board2.png",
                    is_starred: false,
                    is_closed: false,
                    created_at: "2025-02-28T12:30:00Z",
                    lists: [],
                },
                {
                    id: 103,
                    title: "Dự án 3",
                    description: "...",
                    backdrop: "../assets/images/board3.png",
                    is_starred: false,
                    is_closed: false,
                    created_at: "2025-02-28T12:30:00Z",
                    lists: [],
                },
                {
                    id: 104,
                    title: "Dự án 4",
                    description: "...",
                    backdrop: "../assets/images/board4.png",
                    is_starred: false,
                    is_closed: false,
                    created_at: "2025-02-28T12:30:00Z",
                    lists: [],
                },
            ],
        },
    ],
};

// Chỉ tạo dữ liệu mẫu một lần
if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify(data));
}