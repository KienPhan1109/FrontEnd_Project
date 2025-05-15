// Biến Global
const remembered = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser")); // Truy xuất người dùng
const data = JSON.parse(localStorage.getItem("data")) || { users: [] }; // Lấy toàn bộ dữ liệu

document.addEventListener("DOMContentLoaded", () => {
    // Nếu chưa đăng nhập tự động chuyển trang
    if (!remembered) {
        location .href = "./auth/sign-in.html";
        return;
    }

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem("rememberUser");
        sessionStorage.removeItem("sessionUser");
        location.href = "./auth/sign-in.html";
    };

    // Nút đăng xuất
    document.getElementById("sign-out-btn").addEventListener("click", logout);
    document.getElementById("sign-out-btn2").addEventListener("click", logout);

    dashBoardNavigation();
    createDashBoard();
    // Hiển thị board
    renderDashBoards(data, remembered);
});

// Hàm hiển thị DashBoards
function renderDashBoards(data, remembered) {
    const normalContainer = document.getElementById("board-container"); // Boards bình thường
    const starredContainer = document.getElementById("starred-container"); // Boards yêu thích
    const closedContainer = document.getElementById("closed-container"); // Boards đã đóng

    const currentUser = data.users.find(user => user.email === remembered.email); // Lấy ra user đang đăng nhập hiện tại
    
    const boards = currentUser.boards; // Lấy ra board của user đang đăng nhập
    
    // Xóa các thông tin cũ
    normalContainer.innerHTML = "";
    starredContainer.innerHTML = "";
    closedContainer.innerHTML = "";

    boards.forEach(board => {
        const boardCard = document.createElement("div");
        boardCard.className = "card text-bg-dark";

        // Hiển thị board bị đóng
        if (board.is_closed) {
            boardCard.innerHTML = `
                <img src="${board.backdrop}" class="card-img" alt="">
                <div class="card-img-overlay d-flex flex-column justify-content-between">
                    <h5 class="card-title">${board.title}</h5>
                    <div class="d-flex gap-2 action-buttons">
                        <button class="btn btn-primary btn-sm undo"><i class="fa-solid fa-rotate-right"></i></button>
                        <button class="btn btn-danger btn-sm delete-permanent"><i class="fa-solid fa-trash"></i></button>
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
                // Lấy modal xác nhận xóa
                const confirmBtn = document.querySelector("#exampleModalDelete .btn-save");
                confirmBtn.onclick = () => {
                    const index = currentUser.boards.findIndex(b => b.id === board.id);
                    currentUser.boards.splice(index, 1);
                    localStorage.setItem("data", JSON.stringify(data));
                    renderDashBoards(data, remembered);
            
                    const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalDelete"));
                    modal.hide();
                };
            
                // Mở modal sau để đảm bảo sự kiện onclick đã được gán
                const modal = new bootstrap.Modal(document.getElementById("exampleModalDelete"));
                modal.show();
            });

            closedContainer.appendChild(boardCard);
        } else {
            if (board.backdrop?.startsWith("linear-gradient")) {
                // màu nền
                boardCard.innerHTML = `
                    <div class="card-img-overlay" style="background: ${board.backdrop}">
                        <h5 class="card-title">${board.title}</h5>
                        <div class="action-buttons d-flex flex-column gap-1 mt-2">
                            <button type="button" class="edit btn btn-modal" data-bs-toggle="modal" data-bs-target="#modalEditDashBoards" data-id="${board.id}">
                                <i class="fa-regular fa-pen"></i> Edit this board
                            </button>
                            <button type="button" class="delete btn btn-modal">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <button type="button" class="star btn star-btn">
                                <i class="fa-star ${board.is_starred ? 'fa-solid text-warning' : 'fa-regular text-light'}"></i>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // hình ảnh
                boardCard.innerHTML = `
                    <img src="${board.backdrop}" class="card-img" alt="">
                    <div class="card-img-overlay">
                        <h5 class="card-title">${board.title}</h5>
                        <div class="action-buttons d-flex flex-column gap-1 mt-2">
                            <button type="button" class="edit btn btn-modal" data-bs-toggle="modal" data-bs-target="#modalEditDashBoards" data-id="${board.id}">
                                <i class="fa-regular fa-pen"></i> Edit this board
                            </button>
                            <button type="button" class="delete btn btn-modal">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <button type="button" class="star btn star-btn">
                                <i class="fa-star ${board.is_starred ? 'fa-solid text-warning' : 'fa-regular text-light'}"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
            const boardId = board.id; // Giữ lại id của board

            // Khí nhấn vào board sẽ lưu lại id và chuyển trang 
            boardCard.querySelector(".card-img-overlay").addEventListener("click", () => {
                sessionStorage.setItem("selectedBoardId", boardId);
                sessionStorage.setItem("selectedBackdrop", board.backdrop);
                location.href = "./event.html";
            });

            // Nút sửa
            boardCard.querySelector(".edit").addEventListener("click", (e) => {
                e.stopPropagation();
                editDashBoard(boardId);
            });

            // Nút đóng
            boardCard.querySelector(".delete").addEventListener("click", (e) => {
                e.stopPropagation();
                board.is_closed = true;
                localStorage.setItem("data", JSON.stringify(data));
                renderDashBoards(data, remembered);
            });

            // Nút yêu thích
            boardCard.querySelector(".star-btn").addEventListener("click", (e) => {
                e.stopPropagation();
        
                // Tìm đúng user
                const user = data.users.find(u => u.email === remembered.email);
        
                // Tìm đúng board theo id đã giữ sẵn
                const board = user.boards.find(b => b.id === boardId);
        
                // Toggle trạng thái yêu thích
                board.is_starred = !board.is_starred;
        
                // Lưu lại data và re-render
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
    color1: "linear-gradient(to right, rgba(255, 177, 0, 1), rgba(250, 12, 0, 1))",
    color2: "linear-gradient(to right, rgba(38, 9, 255, 1), rgba(210, 12, 255, 1))",
    color3: "linear-gradient(to right, rgba(0, 255, 47, 1), rgba(0, 255, 200, 1))",
    color4: "linear-gradient(to right, rgba(0, 255, 229, 1), rgba(0, 75, 250, 1))",
    color5: "linear-gradient(to right, rgba(255, 162, 0, 1), rgba(237, 250, 0, 1))",
    color6: "linear-gradient(to right, rgba(255, 0, 234, 1), rgba(250, 12, 0, 1))",
};

const imageObject = {
    img1: "../assets/images/board1.png",
    img2: "../assets/images/board2.png",
    img3: "../assets/images/board3.png",
    img4: "../assets/images/board4.png"
};

// Hảm sửa DashBoard
function editDashBoard(boardId) {
    const currentUser = data.users.find(u => u.email === remembered.email);
    const board = currentUser.boards.find(b => b.id === boardId);

    const modalEl = document.getElementById("modalEditDashBoards"); // Lấy modal edit
    const titleInput = modalEl.querySelector("#edit-board-title"); // Lấy ô input
    const saveBtn    = modalEl.querySelector(".btn-save"); // Lấy nút lưu

    // Hiển thị title hiện tại
    titleInput.value = board.title;

    // Các ID hình và màu
    const imageIds = Object.keys(imageObject);
    const colorIds = Object.keys(colorObject);    
    
    // Biến lưu backdrop hiện tại
    let selectedBackdrop = board.backdrop;

    // Reset hết tick
    imageIds.forEach(id => {
        modalEl.querySelector(`#edit-${id} i`)?.classList.add("d-none");
    });
    colorIds.forEach(id => {
        modalEl.querySelector(`#edit-${id} i`)?.classList.add("d-none");
    });

    // Tick đúng theo backdrop hiện tại
    const selImg = imageIds.find(id => imageObject[id] === board.backdrop);
    const selCol = colorIds.find(id => colorObject[id] === board.backdrop);    
    
    if (selImg) modalEl.querySelector(`#edit-${selImg} i`)?.classList.remove("d-none");
    if (selCol) modalEl.querySelector(`#edit-${selCol} i`)?.classList.remove("d-none");

    // Bắt sự kiện chọn hình ảnh
    imageIds.forEach(id => {
        const el = modalEl.querySelector(`#edit-${id}`);
        if (!el) return;
        el.onclick = () => {
            // reset màu
            colorIds.forEach(i => {
                modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none");
            });
            // tick ảnh
            imageIds.forEach(i => {
                modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");

            selectedBackdrop = imageObject[id];
        };
    });

    // Bắt sự kiện chọn màu
    colorIds.forEach(id => {
        const el = modalEl.querySelector(`#edit-${id}`);
        if (!el) return;
        el.onclick = () => {
            // reset ảnh
            imageIds.forEach(i => {
                modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none");
            });
            // tick màu
            colorIds.forEach(i => {
                modalEl.querySelector(`#edit-${i} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");

            // Gán backdrop bằng màu đã chọn
            selectedBackdrop = colorObject[id];
        };
    });

    // Lưu chỉnh sửa
    saveBtn.onclick = () => {
        const newTitle = titleInput.value.trim();
        const validEl  = modalEl.querySelector("#edit-board-title-valid");

        if (!newTitle) {
            validEl.style.color = "red";
            validEl.innerText = "👋 Please provide a valid board title.";
            return;
        }
        validEl.style.color = "transparent";

        // Cập nhật dữ liệu
        board.title    = newTitle;
        board.backdrop = selectedBackdrop; // ✅ backdrop lưu màu nếu có

        localStorage.setItem("data", JSON.stringify(data));
        bootstrap.Modal.getInstance(modalEl).hide();
        renderDashBoards(data, remembered);
    };
}

function createDashBoard() {
    const imageIds = Object.keys(imageObject);
    const colorIds = Object.keys(colorObject);

    const boardTitleInput = document.getElementById("board-title");
    const boardTitleValid = document.getElementById("board-title-valid");
    const createBtn = document.querySelector("#exampleModalCreate .btn-outline-primary");

    let selectedBackdrop = imageObject[imageIds[0]]; // mặc định là img1

    // Tick ảnh mặc định
    document.querySelector(`#${imageIds[0]} i`)?.classList.remove("d-none");

    // === Chọn ảnh ===
    imageIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            // Xóa tick màu
            colorIds.forEach(cid => {
                document.querySelector(`#${cid} i`)?.classList.add("d-none");
            });

            // Tick ảnh
            imageIds.forEach(imgId => {
                document.querySelector(`#${imgId} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");
            selectedBackdrop = imageObject[id];
        });
    });

    // === Chọn màu ===
    colorIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            // Xóa tick ảnh
            imageIds.forEach(imgId => {
                document.querySelector(`#${imgId} i`)?.classList.add("d-none");
            });

            // Tick màu
            colorIds.forEach(cid => {
                document.querySelector(`#${cid} i`)?.classList.add("d-none");
            });
            el.querySelector("i")?.classList.remove("d-none");
            selectedBackdrop = colorObject[id];
        });
    });

    // === Tạo board ===
    createBtn.addEventListener("click", () => {
        const title = boardTitleInput.value.trim();
    
        if (!title) {
            boardTitleValid.style.color = "red";
            boardTitleValid.innerText = "👋 Please provide a valid board title.";
            return;
        }
        boardTitleValid.style.color = "transparent";
    
        const remembered = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
        const data = JSON.parse(localStorage.getItem("data")) || { users: [] };
        const currentUser = data.users.find(u => u.email === remembered.email);
    
        const newBoard = {
            id: Date.now(),
            title,
            backdrop: selectedBackdrop,
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

function dashBoardNavigation() {
    const allSection = document.querySelectorAll(".workspaces");
    const sidebarAll = document.getElementById("sidebar-all");
    const sidebarStarred = document.getElementById("sidebar-starred");
    const sidebarClosed = document.getElementById("sidebar-closed");

    sidebarAll?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.remove("d-none"));
    });

    sidebarStarred?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.add("d-none"));
        document.querySelector("#starred-container")?.closest(".workspaces")?.classList.remove("d-none");
    });

    sidebarClosed?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.add("d-none"));
        document.querySelector("#closed-container")?.closest(".workspaces")?.classList.remove("d-none");
    });

    const navAll = document.getElementById("nav-all");
    const navStarred = document.getElementById("nav-starred");
    const navClosed = document.getElementById("nav-closed");

    navAll?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.remove("d-none"));
    });

    navStarred?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.add("d-none"));
        document.querySelector("#starred-container")?.closest(".workspaces")?.classList.remove("d-none");
    });

    navClosed?.addEventListener("click", () => {
        allSection.forEach(sec => sec.classList.add("d-none"));
        document.querySelector("#closed-container")?.closest(".workspaces")?.classList.remove("d-none");
    });
}
