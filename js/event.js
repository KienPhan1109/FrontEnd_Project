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

    // Ví dụ hiển thị tên board
    document.querySelector(".event-text").textContent = board.title;

    renderBoardLists(board);

     // Nút quay lại dashboard
    document.querySelector(".event-button button").addEventListener("click", () => {
        sessionStorage.removeItem("selectedBoardId");
        location.href = "./dashboard.html";
    });
});

function renderBoardLists(board) {
    const container = document.querySelector(".container-todo");
    container.innerHTML = "";

    board.lists?.forEach((list, listIndex) => {
        const card = document.createElement("div");
        card.className = "card-event";
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <div contenteditable="true" class="editable-list-title" data-index="${listIndex}">${list.title}</div>
                <div><i class="fa-solid fa-ellipsis pointer delete-list" data-index="${listIndex}"></i></div>
            </div>
            <div class="card-body d-flex flex-column gap-2" data-list-index="${listIndex}">
                ${list.tasks?.map((task, taskIndex) => `
                    <div class="card-todo editable-task" data-list-index="${listIndex}" data-task-index="${taskIndex}">
                        <i class="fa-${task.done ? 'solid' : 'regular'} fa-circle${task.done ? '-check' : ''} task-toggle" data-list="${listIndex}" data-task="${taskIndex}"></i>
                        <span class="${task.done ? 'text-decoration-line-through text-muted' : ''}">${task.title}</span>
                    </div>
                `).join("")}
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-light add-card-btn" data-index="${listIndex}"><i class="fa-solid fa-plus"></i> Add a card</button>
                    <div class="add-card-form d-none mt-1">
                        <input type="text" class="form-control mb-1 card-title-input w-100" placeholder="Enter card title..." />
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-sm btn-primary save-card">Add</button>
                            <button class="btn btn-sm btn-secondary cancel-card">Cancel</button>
                        </div>
                    </div>
                </div>
                <div class="delete-list-icon" data-list-index="${listIndex}">
                    <img src="../assets/icons/event.png" alt="delete" />
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
                <input type="text" class="form-control mb-1 list-title-input" placeholder="Enter list title..." />
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary save-list">Add list</button>
                    <button class="btn btn-sm btn-secondary cancel-list">Cancel</button>
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
        if (!title) return;
        board.lists.push({ title, tasks: [] });
        updateBoardData(board);
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
                if (!value) return;
    
                board.lists[index].tasks.push({ title: value });
                updateBoardData(board);
    
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

    // Lấy đúng icon ở card-footer để gán sự kiện
    document.querySelectorAll(".card-footer img").forEach((img, index) => {
        img.addEventListener("click", () => {
            targetDeleteListIndex = index;
            const deleteModal = new bootstrap.Modal(document.getElementById("exampleModalDelete"));
            deleteModal.show();
        });
    });
    document.querySelector(".btn-save").addEventListener("click", () => {
        if (targetDeleteListIndex !== null) {
            // 1. Xoá list trong dữ liệu
            board.lists.splice(targetDeleteListIndex, 1);
    
            // 2. Cập nhật localStorage
            const user = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
            const data = JSON.parse(localStorage.getItem("data"));
            const currentUser = data.users.find(u => u.email === user.email);
            const index = currentUser.boards.findIndex(b => b.id === board.id);
            currentUser.boards[index] = board;
            localStorage.setItem("data", JSON.stringify(data));
    
            // 3. Xoá phần tử DOM tương ứng
            const cardElements = document.querySelectorAll(".card-event");
            const listCard = cardElements[targetDeleteListIndex];
            if (listCard) listCard.remove();
    
            // 4. Ẩn modal
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

