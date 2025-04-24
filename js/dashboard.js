document.addEventListener("DOMContentLoaded", () => {
    const remembered = JSON.parse(localStorage.getItem("rememberUser"));  // Dữ liệu local nếu tích vào ghi nhớ
    const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser")); // Dữ liệu session nếu không tích vào ghi nhớ

    const currentLogin = remembered || sessionUser;

    // Nếu chưa đăng nhập tự động chuyển trang
    if (!currentLogin) {
        location.href = "./auth/sign-in.html";
        return;
    }

    const data = JSON.parse(localStorage.getItem("data")) || { users: [] };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem("rememberUser");
        sessionStorage.removeItem("sessionUser");
        location.href = "./auth/sign-in.html";
    };

    document.getElementById("sign-out-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
    });

    document.getElementById("sign-out-btn2")?.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
    });
    setupCreateBoardModal();
    // Hiển thị board
    renderDashBoards(data, currentLogin);

});


function renderDashBoards(data, remembered) {
    const normalContainer = document.getElementById("board-container"); // Boards bình thường
    const starredContainer = document.getElementById("starred-container"); // Boards yêu thích
    const closedContainer = document.getElementById("closed-container"); // Boards đã đóng

    const currentUser = data.users.find(user => user.email === remembered.email); // Lấy ra user đang đăng nhập hiện tại
    const boards = currentUser.boards; // Lấy ra board của user đang đăng nhập

    normalContainer.innerHTML = "";
    starredContainer.innerHTML = "";
    closedContainer.innerHTML = "";

    boards.forEach(board => {
        const boardCard = document.createElement("div");
        boardCard.className = "card text-bg-dark";

        if (board.is_closed) {
            boardCard.innerHTML = `
                <img src="${board.backdrop}" class="card-img" alt="">
                <div class="card-img-overlay d-flex flex-column justify-content-between">
                    <h5 class="card-title">${board.title}</h5>
                    <div class="d-flex gap-2 action-buttons">
                        <button class="btn btn-primary btn-sm undo">Undo</button>
                        <button class="btn btn-danger btn-sm delete-permanent">Delete</button>
                    </div>
                </div>
            `;

            // Nút hoàn tác
            boardCard.querySelector(".undo").addEventListener("click", () => {
                board.is_closed = false;
                localStorage.setItem("data", JSON.stringify(data));
                renderDashBoards(data, remembered);
            });

            // Xóa hoàn toàn
            boardCard.querySelector(".delete-permanent").addEventListener("click", (e) => {
                const confirmBtn = document.querySelector("#exampleModalDelete .btn-save");
                confirmBtn.onclick = () => {
                    const index = currentUser.boards.findIndex(b => b.id === board.id);
                    currentUser.boards.splice(index, 1);
                    localStorage.setItem("data", JSON.stringify(data));
                    renderDashBoards(data, remembered);
            
                    const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalDelete"));
                    modal.hide();
                };
            
                // Hiển thị modal (chuyển modal về đúng vị trí sử dụng)
                const modal = new bootstrap.Modal(document.getElementById("exampleModalDelete"));
                modal.show();
            });

            closedContainer.appendChild(boardCard);
        } else {
            boardCard.innerHTML = `
                <img src="${board.backdrop}" class="card-img" alt="">
                <div class="card-img-overlay">
                    <h5 class="card-title" style="color: ${board.color}">${board.title}</h5>
                    <div class="action-buttons d-flex flex-column gap-1 mt-2">
                        <button type="button" class="edit btn btn-modal" onclick="editBoard(${board.id})" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">
                            <i class="fa-regular fa-pen"></i> Edit this board
                        </button>
                        <button type="button" class="delete btn btn-modal">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button type="button" class="star btn star-btn" data-id="${board.id}">
                            <i class="fa-star ${board.is_starred ? 'fa-solid text-warning' : 'fa-regular text-light'}"></i>
                        </button>
                    </div>
                </div>
            `;

            // Khí nhấn vào board sẽ lưu lại id và chuyển trang 
            boardCard.querySelector(".card-img-overlay").addEventListener("click", () => {
                sessionStorage.setItem("selectedBoardId", board.id);
                location.href = "./event.html";
            });

            boardCard.querySelector(".edit").addEventListener("click", (e) => {
                e.stopPropagation();
            });

            // Nút xóa
            boardCard.querySelector(".delete").addEventListener("click", (e) => {
                e.stopPropagation();
                board.is_closed = true;
                localStorage.setItem("data", JSON.stringify(data));
                renderDashBoards(data, remembered);
            });

            // Nút yêu thích
            boardCard.querySelector(".star-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                const boardId = parseInt(e.currentTarget.dataset.id);
                const user = data.users.find(u => u.email === remembered.email);
                const board = user.boards.find(b => b.id === boardId);

                board.is_starred = !board.is_starred;

                localStorage.setItem("data", JSON.stringify(data));
                renderDashBoards(data, remembered);
            });

            if (board.is_starred) {
                starredContainer.appendChild(boardCard);
            } else {
                normalContainer.appendChild(boardCard);
            }
        }
    });


    // Thêm nút "Create new board" ở cuối
    const createCard = document.createElement("div");
    createCard.className = "card d-flex justify-content-center create align-items-center";
    createCard.innerHTML = `
        <button type="button" class="btn btn-modal" data-bs-toggle="modal" data-bs-target="#exampleModalCreate">
            Create new board
        </button>
    `;
    normalContainer.appendChild(createCard);

}

// Màu và hình ảnh mặc định của hàm thêm và sửa
const colorObject = {
    color1: "#ffb100",
    color2: "#2609ff",
    color3: "#00ff2f",
    color4: "#00ffe5",
    color5: "#ffa200",
    color6: "#ff00ea"
};

const imageObject = {
    img1: "../assets/images/board1.png",
    img2: "../assets/images/board2.png",
    img3: "../assets/images/board3.png",
    img4: "../assets/images/board4.png"
};

function setupCreateBoardModal() {
    // Lấy các keys từ hai Object
    const imageIds = Object.keys(imageObject);
    const colorIds = Object.keys(colorObject);

    const boardTitleInput = document.getElementById("board-title");
    const boardTitleValid = document.getElementById("board-title-valid");
    const createBtn = document.querySelector("#exampleModalCreate .btn-outline-primary");

    let selectedBackdrop = imageObject[imageIds[0]]; // Ảnh mặc định
    let selectedColor = colorObject[colorIds[0]]; // Màu chữ mặc định

    // Tick mặc định
    document.querySelector(`#${imageIds[0]} i`)?.classList.remove("d-none");
    document.querySelector(`#${colorIds[0]} i`)?.classList.remove("d-none");

    // Click chọn hình ảnh
    imageIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            imageIds.forEach(imgId => {
                document.querySelector(`#${imgId} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");
            selectedBackdrop = imageObject[id];
        });
    });

    // === Click chọn màu chữ ===
    colorIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            colorIds.forEach(colorId => {
                document.querySelector(`#${colorId} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");
            selectedColor = colorObject[id];
        });
    });

    boardTitleValid.innerText = "";
    // === Tạo board ===
    createBtn.addEventListener("click", () => {
        const title = boardTitleInput.value.trim();
        if (!title) {
            boardTitleValid.style.color = "red";
            boardTitleValid.innerText = "👋 Please provide a valid board title.";
            return;
        } else {
            boardTitleValid.style.color = "transparent";
            boardTitleValid.innerText = "";
        }

        const remembered = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
        const data = JSON.parse(localStorage.getItem("data")) || { users: [] };
        const currentUser = data.users.find(u => u.email === remembered.email);

        const newBoard = {
            id: Date.now(),
            title,
            description: "",
            backdrop: selectedBackdrop,
            color: selectedColor,
            is_starred: false,
            is_closed: false,
            created_at: new Date().toISOString(),
            lists: []
        };

        currentUser.boards.push(newBoard);
        localStorage.setItem("data", JSON.stringify(data));

        const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalCreate"));
        modal.hide();
        boardTitleInput.value = "";

        renderDashBoards(data, remembered);
    });
}

function editBoard(boardId) {
    const remembered = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
    const data = JSON.parse(localStorage.getItem("data")) || { users: [] };
    const currentUser = data.users.find(u => u.email === remembered.email);
    const board = currentUser.boards.find(b => b.id === boardId);

    if (!board) return;

    const modalEl = document.getElementById("exampleModalEdit");
    const titleInput = modalEl.querySelector("#edit-board-title");
    const saveBtn = modalEl.querySelector(".btn-save");

    // Gán lại title
    titleInput.value = board.title;

    // Chuẩn bị dữ liệu
    const imageIds = Object.keys(imageObject);
    const colorIds = Object.keys(colorObject);

    let selectedBackdrop = board.backdrop;
    let selectedColor = board.color;

    // Reset icon chọn
    imageIds.forEach(id => modalEl.querySelector(`#edit-${id} i`)?.classList.add("d-none"));
    colorIds.forEach(id => modalEl.querySelector(`#edit-${id} i`)?.classList.add("d-none"));

    const selectedImgId = imageIds.find(id => imageObject[id] === board.backdrop);
    const selectedColorId = colorIds.find(id => colorObject[id] === board.color);

    modalEl.querySelector(`#edit-${selectedImgId} i`)?.classList.remove("d-none");
    modalEl.querySelector(`#edit-${selectedColorId} i`)?.classList.remove("d-none");

    // Bắt sự kiện click hình ảnh
    imageIds.forEach(id => {
        const el = modalEl.querySelector(`#edit-${id}`);
        if (!el) return;
        el.onclick = () => {
            imageIds.forEach(i => modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none"));
            el.querySelector("i")?.classList.remove("d-none");
            selectedBackdrop = imageObject[id];
        };
    });

    // Bắt sự kiện click màu
    colorIds.forEach(id => {
        const el = modalEl.querySelector(`#edit-${id}`);
        if (!el) return;
        el.onclick = () => {
            colorIds.forEach(i => modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none"));
            el.querySelector("i")?.classList.remove("d-none");
            selectedColor = colorObject[id];
        };
    });

    const validEl = modalEl.querySelector("#edit-board-title-valid");
    // Lưu chỉnh sửa
    validEl.innerText = '';
    saveBtn.onclick = () => {
        const newTitle = titleInput.value.trim();

        if (!newTitle) {
            validEl.style.color = "red";
            validEl.innerText = "👋 Please provide a valid board title.";
            return;
            } else {
                validEl.style.color = "transparent"; // hoặc "inherit"
            }

            board.title = newTitle;
            board.backdrop = selectedBackdrop;
            board.color = selectedColor;

            localStorage.setItem("data", JSON.stringify(data));

            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            renderDashBoards(data, remembered);
        };
}



