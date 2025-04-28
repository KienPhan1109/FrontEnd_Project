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

    if (!board) {
        alert("Board không tồn tại!");
        return;
    }
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
                    <div class="card-todo editable-task" data-list-index="${listIndex}" data-task-index="${taskIndex}">
                        <i class="fa-${task.done ? 'solid' : 'regular'} fa-circle${task.done ? '-check' : ''} task-toggle" data-list="${listIndex}" data-task="${taskIndex}"></i>
                        <span class="${task.done ? 'text-decoration-line-through text-muted' : ''}">${task.title}</span>
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
    
                board.lists[index].tasks.push({ title: value });
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
                board.lists[listIndex].title = newTitle || "Untitled";
                updateBoardData(board);
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
                board.lists[listIndex].tasks[taskIndex].title = newText || "Untitled";
                updateBoardData(board);
            });
    
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") input.blur();
            });
        });
    });
    
    // === Toggle hoàn thành task
    container.querySelectorAll(".task-toggle").forEach(icon => {
        icon.addEventListener("click", () => {
            const listIndex = icon.dataset.list;
            const taskIndex = icon.dataset.task;
            const task = board.lists[listIndex].tasks[taskIndex];

            task.done = !task.done;
            updateBoardData(board);
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
    
}

function updateBoardData(board) {
    const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
    const data = JSON.parse(localStorage.getItem("data"));
    const currentUser = data.users.find(u => u.email === user.email);
    const index = currentUser.boards.findIndex(b => b.id === board.id);
    currentUser.boards[index] = board;
    localStorage.setItem("data", JSON.stringify(data));
    renderBoardLists(board);
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
}