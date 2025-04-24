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

    if (!board.lists || board.lists.length === 0) {
        // Trường hợp chưa có khung nào
        const addListCard = document.createElement("div");
        addListCard.className = "card-event";
        addListCard.innerHTML = `
            <div class="d-flex align-items-baseline gap-2 pt-1 pb-1">
                <i class="fa-solid fa-plus"></i>
                Add another list
            </div>
        `;
        container.appendChild(addListCard);
        return;
    }

    board.lists.forEach(list => {
        const card = document.createElement("div");
        card.className = "card-event";
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>${list.title}</div>
                <div><i class="fa-solid fa-ellipsis"></i></div>
            </div>
            <div class="card-body d-flex flex-column gap-2">
                ${list.tasks && list.tasks.length > 0 ? list.tasks.map(task => `
                    <div class="card-todo">
                        <i class="fa-solid fa-circle-check"></i>
                        ${task.title}
                    </div>
                `).join('') : "<div class='text-muted text-center'>No tasks</div>"}
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-baseline gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Add a card
                </div>
                <img src="../assets/icons/event.png" alt="">
            </div>
        `;
        container.appendChild(card);
    });

    // Card để tạo list mới (luôn có)
    const addListCard = document.createElement("div");
    addListCard.className = "card-event";
    addListCard.innerHTML = `
        <div class="d-flex align-items-baseline gap-2 pt-1 pb-1">
            <i class="fa-solid fa-plus"></i>
            Add another list
        </div>
    `;
    container.appendChild(addListCard);
}
