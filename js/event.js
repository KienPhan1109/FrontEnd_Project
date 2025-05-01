document.addEventListener("DOMContentLoaded", () => {
    const boardId = parseInt(sessionStorage.getItem("selectedBoardId"));
    const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
    const data = JSON.parse(localStorage.getItem("data"));

    if (!user || !boardId) {
        location.href = "./dashboard.html"; // Không có dữ liệu -> đá về
        return;
    }

    const currentUser = data.users.find(u => u.email === user.email);
    const board = currentUser.boards.find(b => b.id === boardId);

    const selectedBackdrop = sessionStorage.getItem("selectedBackdrop");
    // Gán background vào thẻ main
    const main = document.querySelector(".main");
    
    if (selectedBackdrop) {
        if (selectedBackdrop.startsWith("linear-gradient")) {
            // Nếu là màu gradient
            main.style.background = selectedBackdrop;
        } else {
            // Nếu là hình ảnh
            main.style.background = `url(${selectedBackdrop}) center/cover no-repeat`;
        }
    }
    
    // Ví dụ hiển thị tên board
    document.querySelector(".event-text").textContent = board.title;

    renderYourBoards(currentUser);
    renderYourBoards2(currentUser);
    renderBoardLists(board);

     // Nút quay lại dashboard
    document.querySelector(".event-button button").addEventListener("click", () => {
        sessionStorage.removeItem("selectedBoardId");
        location.href = "./dashboard.html";
    });
    setupBoardHeader(board);
    
});

function renderYourBoards(currentUser) {
    const yourBoardsContainer = document.querySelector(".your-boards");
    yourBoardsContainer.innerHTML = "";

    currentUser.boards
        .filter(board => !board.is_closed) // Chỉ lấy board đang mở
        .forEach(board => {
            const boardItem = document.createElement("div");
            boardItem.className = "items-event pointer";
            boardItem.innerHTML = `
                ${board.backdrop.startsWith('linear-gradient') 
                    ? `<div class="board-color" style="background: ${board.backdrop}"></div>` 
                    : `<img src="${board.backdrop}">`
                }
                <span class="ms-2">${board.title}</span>
            `;
            boardItem.addEventListener("click", () => {
                sessionStorage.setItem("selectedBoardId", board.id);
                sessionStorage.setItem("selectedBackdrop", board.backdrop);
                location.href = "./event.html"; // Load lại event.html với board mới
            });

            yourBoardsContainer.appendChild(boardItem);
        });
}

function renderYourBoards2(currentUser) {
    const yourBoardsContainer = document.querySelector(".your-boards2");
    yourBoardsContainer.innerHTML = "";

    currentUser.boards
        .filter(board => !board.is_closed) // Chỉ lấy board đang mở
        .forEach(board => {
            const boardItem = document.createElement("div");
            boardItem.className = "items-event pointer";
            boardItem.innerHTML = `
                ${board.backdrop.startsWith('linear-gradient') 
                    ? `<div class="board-color" style="background: ${board.backdrop}"></div>` 
                    : `<img src="${board.backdrop}">`
                }
                <span class="ms-2">${board.title}</span>
            `;
            boardItem.addEventListener("click", () => {
                sessionStorage.setItem("selectedBoardId", board.id);
                sessionStorage.setItem("selectedBackdrop", board.backdrop);
                location.href = "./event.html"; // Load lại event.html với board mới
            });

            yourBoardsContainer.appendChild(boardItem);
        });
}

function renderBoardLists(board) {
    const container = document.querySelector(".container-todo");
    container.innerHTML = "";

    board.lists?.forEach((list, listIndex) => {
        const card = document.createElement("div");
        card.className = "card-event";
        card.innerHTML = `
            <div class="card-header d-flex align-items-center justify-content-between gap-2">
                <div class="flex-grow-1">
                    <div contenteditable="true" class="editable-list-title w-100" data-index="${listIndex}">
                        ${list.title}
                    </div>
                </div>
                <div class="delete-list-menu" data-list-index="${listIndex}" style="flex-shrink: 0;" data-bs-toggle="modal" data-bs-target="#modalDetailCard">
                    <i class="fa-solid fa-ellipsis pointer"></i>
                </div>

            </div>
            <div class="card-body d-flex flex-column gap-2 mb-2" data-list-index="${listIndex}">
                ${list.tasks?.map((task, taskIndex) => `
                    <div class="card-todo editable-task ${task.status === "completed" ? 'completed' : ''}" data-list-index="${listIndex}" data-task-index="${taskIndex}">
                        <i class="fa-${task.status === "completed" ? 'solid' : 'regular'} fa-circle${task.status === "completed" ? '-check' : ''} task-toggle" data-list="${listIndex}" data-task="${taskIndex}"></i>
                        <span>${task.title}</span>
                        <div class="task-menu-icon ms-auto" data-list="${listIndex}" data-task="${taskIndex}">
                            <i class="fa-solid fa-ellipsis pointer" data-bs-toggle="modal" data-bs-target="#modalDetailCard"></i>
                        </div>
                    </div>
                `).join("")}
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between gap-2">
                <div class="flex-grow-1">
                    <button class="btn btn-sm btn-light w-100 add-card-btn" data-index="${listIndex}">
                        <i class="fa-solid fa-plus"></i> Add a card
                    </button>
                    <div class="add-card-form d-none">
                        <input type="text" class="form-control mb-2 card-title-input w-100" placeholder="Enter a title or paste a link" />
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-primary save-card">Add card</button>
                            <button class="btn btn-sm cancel-card"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </div>
                <div class="delete-list-icon" data-list-index="${listIndex}" style="flex-shrink: 0;">
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Form thêm list
    const addListCard = document.createElement("div");
    addListCard.className = "card-event";
    addListCard.innerHTML = `
        <div class="add-list-container">
            <button class="btn btn-light w-100 add-list-btn"><i class="fa-solid fa-plus"></i> Add another list</button>
            <div class="add-list-form d-none mt-2">
                <input type="text" class="form-control mb-2 list-title-input" placeholder="Enter list title..." />
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary save-list">Add list</button>
                    <button class="btn btn-sm cancel-list"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(addListCard);

    setupListEvents(board);
}

function setupTaskToggle(board) {
    document.querySelectorAll(".task-toggle").forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.stopPropagation(); // không trigger click vào task để sửa text

            const listIndex = icon.dataset.list;
            const taskIndex = icon.dataset.task;
            const task = board.lists[listIndex].tasks[taskIndex];

            task.status = (task.status === "completed") ? "pending" : "completed";

            updateBoardData(board);
        });
    });
}

function setupListEvents(board) {
    const container = document.querySelector(".container-todo");

    // === Thêm list ===
    container.querySelector(".add-list-btn").addEventListener("click", () => {
        container.querySelector(".add-list-form").classList.remove("d-none");
        container.querySelector(".add-list-btn").classList.add("d-none");
    });

    container.querySelector(".save-list").addEventListener("click", () => {
        const input = container.querySelector(".list-title-input");
        const title = input.value.trim();
        if (!title) return showError("Tên danh sách không được để trống!");
        board.lists.push({ title, tasks: [] });
        updateBoardData(board);
        showSuccess("Tạo danh sách thành công!");
    });

    container.querySelector(".cancel-list").addEventListener("click", () => {
        container.querySelector(".add-list-form").classList.add("d-none");
        container.querySelector(".add-list-btn").classList.remove("d-none");
    });

    // === Thêm card ===
    container.querySelectorAll(".add-card-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const footer = btn.closest(".card-footer");
    
            // Ẩn form khác nếu có
            footer.querySelector(".add-card-form").classList.remove("d-none");
            btn.classList.add("d-none");
    
            // Ẩn icon xoá
            footer.querySelector(".delete-list-icon").classList.add("d-none");
    
            const saveBtn = footer.querySelector(".save-card");
            const cancelBtn = footer.querySelector(".cancel-card");
            const input = footer.querySelector(".card-title-input");
    
            saveBtn.onclick = () => {
                const value = input.value.trim();
                if (!value) return showError("Tên công việc không được để trống!");
    
                board.lists[index].tasks.push({
                    title: value,
                    description: "",
                    status: "pending",
                    created_at: new Date().toISOString(),
                    tag: []
                });
                
                updateBoardData(board);
                showSuccess("Thêm công việc thành công!");

                // Hiện lại icon xoá sau khi thêm
                footer.querySelector(".delete-list-icon").classList.remove("d-none");
            };
    
            cancelBtn.onclick = () => {
                footer.querySelector(".add-card-form").classList.add("d-none");
                btn.classList.remove("d-none");
    
                // Hiện lại icon xoá khi huỷ
                footer.querySelector(".delete-list-icon").classList.remove("d-none");
            };
        });
    });
    

    // === Sửa tiêu đề list (on blur)
    container.querySelectorAll(".editable-list-title").forEach(titleEl => {
        titleEl.addEventListener("click", () => {
            const listIndex = titleEl.dataset.index;
            const oldTitle = titleEl.textContent.trim();
    
            const input = document.createElement("input");
            input.className = "form-control";
            input.type = "text";
            input.value = oldTitle;
    
            titleEl.replaceWith(input);
            input.focus();
    
            // Lưu khi blur
            input.addEventListener("blur", () => {
                const newTitle = input.value.trim();
                if (!newTitle) {
                    showError("Tên danh sách không được để trống");
                    input.focus();
                    return;
                }
                board.lists[listIndex].title = newTitle;
                updateBoardData(board);
                showSuccess("Cập nhật tên danh sách thành công");
            });

            // Hoặc Enter
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
        });
    });

    // === Sửa task
    container.querySelectorAll(".editable-task").forEach(taskEl => {
        taskEl.addEventListener("click", () => {
            const listIndex = taskEl.dataset.listIndex;
            const taskIndex = taskEl.dataset.taskIndex;
            const oldText = taskEl.innerText.trim();
    
            const input = document.createElement("input");
            input.className = "form-control";
            input.type = "text";
            input.value = oldText;
    
            taskEl.replaceWith(input);
            input.focus();
    
            input.addEventListener("blur", () => {
                const newText = input.value.trim();
                if (!newText) {
                    showError("Tên công việc không được để trống");
                    input.focus();
                    return;
                }
                board.lists[listIndex].tasks[taskIndex].title = newText;
                updateBoardData(board);
            });
    
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") input.blur();
            });
        });
    });

    let targetDeleteListIndex = null;

    // Bắt sự kiện click vào icon delete
    document.querySelectorAll(".delete-list-icon i").forEach(icon => {
        icon.addEventListener("click", () => {
            targetDeleteListIndex = icon.closest(".delete-list-icon").dataset.listIndex;
            const deleteModal = new bootstrap.Modal(document.getElementById("exampleModalDelete"));
            deleteModal.show();
        });
    });
    
    // Xác nhận xoá
    document.querySelector(".btn-save").addEventListener("click", () => {
        if (targetDeleteListIndex !== null) {
            board.lists.splice(targetDeleteListIndex, 1); // Xóa list đúng index
            updateBoardData(board); // Update LocalStorage + render lại
    
            // Ẩn modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalDelete"));
            modal.hide();
    
            targetDeleteListIndex = null;
        }
    });
    
    // Bắt sự kiện click vào icon dấu 3 chấm của task
    container.querySelectorAll(".task-menu-icon i").forEach(icon => {
        icon.addEventListener("click", () => {
            const listIndex = icon.closest(".task-menu-icon").dataset.list;
            const taskIndex = icon.closest(".task-menu-icon").dataset.task;
            const task = board.lists[listIndex].tasks[taskIndex];
    
            // Hiện title
            const titleEl = document.querySelector("#modalDetailCard .task-title");
            titleEl.textContent = task.title;
    
            // Hiện description
            const descTextarea = document.querySelector("#modalDetailCard textarea");
            descTextarea.value = task.description || "";
    
            // Hiện list hiện tại
            const moveTaskBtn = document.querySelector("#modalDetailCard .move-task-open-modal");
            if (moveTaskBtn) {
                moveTaskBtn.innerHTML = `${board.lists[listIndex].title} <i class="fa-regular fa-chevron-down"></i>`;

                moveTaskBtn.onclick = () => {
                    const boardNameInput = document.getElementById("moveTaskBoardName");
                    const listSelect = document.getElementById("moveTaskListSelect");
                    const positionSelect = document.getElementById("moveTaskPositionSelect");

                    // Gán tên board
                    boardNameInput.value = board.title;

                    // Load list options
                    listSelect.innerHTML = board.lists.map((l, idx) =>
                    `<option value="${idx}" ${idx == listIndex ? 'selected' : ''}>${l.title}</option>`
                    ).join("");

                    const loadPositions = (listIndex) => {
                        const listLength = board.lists[listIndex].tasks.length;
                        positionSelect.innerHTML = Array.from({length: listLength}, (_, i) =>
                            `<option value="${i}">${i + 1}</option>`
                        ).join("");
                    };

                    loadPositions(listIndex);

                    listSelect.onchange = () => {
                    loadPositions(listSelect.value);
                    };

                    // Ẩn modalDetailCard trước
                    const taskModal = bootstrap.Modal.getInstance(document.getElementById("modalDetailCard"));
                    taskModal.hide();

                    // Rồi mở modalMoveTask
                    const moveModal = new bootstrap.Modal(document.getElementById("modalMoveTask"));
                    moveModal.show();
                };
            }


           // Hiện trạng thái icon
            const statusIcon = document.querySelector("#modalDetailCard .task-status-icon");
            statusIcon.className = `task-status-icon fa-${task.status === "completed" ? 'solid' : 'regular'} fa-circle${task.status === "completed" ? '-check' : ''}`;

            // Gán click đổi trạng thái
            statusIcon.onclick = () => {
                task.status = (task.status === "completed") ? "pending" : "completed";
                updateBoardData(board);
                showSuccess("Cập nhật trạng thái thành công!");

                // Cập nhật icon trạng thái trong modal
                statusIcon.className = `task-status-icon fa-${task.status === "completed" ? 'solid' : 'regular'} fa-circle${task.status === "completed" ? '-check' : ''}`;
            };

            // Gán lại nút lưu
            document.querySelector("#modalDetailCard .save-task").onclick = () => {
                task.title = titleEl.textContent.trim();
                task.description = descTextarea.value.trim();
                updateBoardData(board);
                showSuccess("Lưu task thành công!");
            
                // Đóng modal sau khi lưu
                const taskModal = bootstrap.Modal.getInstance(document.getElementById("modalDetailCard"));
                taskModal.hide();
            };
    
            // Gán list & task index để xoá task đúng
            window.targetListIndex = listIndex;
            window.targetTaskIndex = taskIndex;
        });
    });

    setupTaskToggle(board);
}

function updateBoardData(board) {
    const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
    const data = JSON.parse(localStorage.getItem("data"));
    const currentUser = data.users.find(u => u.email === user.email);
    const index = currentUser.boards.findIndex(b => b.id === board.id);
    currentUser.boards[index] = board;
    localStorage.setItem("data", JSON.stringify(data));

    renderBoardLists(board);
    setupTaskToggle(board);
    setupListEvents(board);
}

function setupBoardHeader(board) {
    const boardTitle = document.querySelector(".event-text");
    const starIcon = document.querySelector(".event-star-icon i");
    const main = document.querySelector(".event-title");

    // Gán tiêu đề
    boardTitle.textContent = board.title;

    // Gán trạng thái dấu sao
    if (board.is_starred) {
        starIcon.classList.add("fa-solid");
        starIcon.classList.remove("fa-regular");
    } else {
        starIcon.classList.add("fa-regular");
        starIcon.classList.remove("fa-solid");
    }

    // Toggle dấu sao
    starIcon.addEventListener("click", () => {
        board.is_starred = !board.is_starred;
        starIcon.classList.toggle("fa-solid", board.is_starred);
        starIcon.classList.toggle("fa-regular", !board.is_starred);
        updateBoardData(board);
    });
}

const alertBox = document.getElementById("alert-box");
// Hàm thông báo lỗi
function showError(message) {
    alertBox.innerHTML = `
        <div class="alert-box-error-dashboard">
            <div class="alert d-flex flex-column gap-2" role="alert">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <img src="../../assets/icons/remove_circle.png" alt="Error icon" class="icon-error" />
                        <strong>Error</strong>
                    </div>
                    <button type="button" class="btn-close-custom" data-bs-dismiss="alert" aria-label="Close">
                        <img src="../../assets/icons/close.png" alt="Close icon" />
                    </button>
                </div>
                <div class="error-messages">
                    <div>${message}</div>
                </div>
            </div>
        </div>
    `;

    // Tự ẩn sau 1 giây
    setTimeout(() => {
        alertBox.innerHTML = "";
    }, 1000);
}

// Hàm thông báo đăng nhập thành công
function showSuccess(message) {
    alertBox.innerHTML = `
        <div class="alert-box-successful-dashboard">
            <div class="alert d-flex align-items-center" role="alert">
                <div>
                    <img src="../../assets/icons/check_circle.png" alt="Success icon" class="icon-successful" />
                </div>
                <div class="successful-messages">
                    ${message}
                </div>
            </div>
        </div>
    `;

    // Tự ẩn sau 1 giây
    setTimeout(() => {
        alertBox.innerHTML = "";
    }, 1000);
}

// Bắt sự kiện nút xác nhận xóa trong modal xác nhận
document.querySelector("#exampleModalDelete .btn-save").addEventListener("click", () => {
    if (window.targetListIndex !== undefined && window.targetTaskIndex !== undefined) {
        const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
        const data = JSON.parse(localStorage.getItem("data"));
        const currentUser = data.users.find(u => u.email === user.email);
        const boardId = parseInt(sessionStorage.getItem("selectedBoardId"));
        const board = currentUser.boards.find(b => b.id === boardId);

        // Xóa task
        board.lists[window.targetListIndex].tasks.splice(window.targetTaskIndex, 1);

        // Cập nhật localStorage
        localStorage.setItem("data", JSON.stringify(data));

        // Hiện thông báo thành công
        showSuccess("Xóa task thành công!");

        // Ẩn modal xác nhận và modal task
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById("exampleModalDelete"));
        deleteModal.hide();
        const taskModal = bootstrap.Modal.getInstance(document.getElementById("modalDetailCard"));
        taskModal.hide();

        // Cập nhật lại UI
        renderBoardLists(board);
        setupListEvents(board);
        setupTaskToggle(board);
    }
});

document.querySelector("#modalDetailCard .btn-danger").onclick = () => {
    const taskModal = bootstrap.Modal.getInstance(document.getElementById("modalDetailCard"));
    taskModal.hide();

    const deleteModal = new bootstrap.Modal(document.getElementById("exampleModalDelete"));
    deleteModal.show();
};

// Xử lý nhấn move
document.getElementById("confirmMoveTask").onclick = () => {
    const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
    const data = JSON.parse(localStorage.getItem("data"));
    const currentUser = data.users.find(u => u.email === user.email);
    const boardId = parseInt(sessionStorage.getItem("selectedBoardId"));
    const board = currentUser.boards.find(b => b.id === boardId);

    // Lấy thông tin chọn
    const toListIndex = parseInt(document.getElementById("moveTaskListSelect").value);
    const position = parseInt(document.getElementById("moveTaskPositionSelect").value);

    // Lấy task
    const task = board.lists[window.targetListIndex].tasks[window.targetTaskIndex];

    // Xóa task khỏi list cũ
    board.lists[window.targetListIndex].tasks.splice(window.targetTaskIndex, 1);

    // Chèn vào list mới ở vị trí mới
    board.lists[toListIndex].tasks.splice(position, 0, task);

    // Cập nhật localStorage
    localStorage.setItem("data", JSON.stringify(data));

    // Cập nhật UI
    renderBoardLists(board);
    setupListEvents(board);
    showSuccess("Di chuyển task thành công!");

    // Đóng modal MoveTask
    const moveModal = bootstrap.Modal.getInstance(document.getElementById("modalMoveTask"));
    moveModal.hide();
};

