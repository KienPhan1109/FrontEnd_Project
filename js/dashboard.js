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

    // Hiển thị board
    renderDashBoards(data, currentLogin);
    setupCreateBoardModal();
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
                    <h5 class="card-title">${board.title}</h5>
                    <div class="action-buttons d-flex flex-column gap-1 mt-2">
                        <button type="button" class="edit btn btn-modal" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">
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
function setupCreateBoardModal() {
    // Danh sách ID của hình ảnh và color
    const imageIds = ["img1", "img2", "img3", "img4"];
    const colorIds = ["color1", "color2", "color3", "color4", "color5", "color6"];

    const boardTitleInput = document.getElementById("board-title");
    const boardTitleValid = document.getElementById("board-title-valid");
    const createBtn = document.querySelector("#exampleModalCreate .btn-outline-primary");

    // Map màu chữ cố định theo ID (bạn có thể điều chỉnh giá trị hex theo ý)
    const colorMap = {
        color1: "#ffb100",
        color2: "#2609ff",
        color3: "#00ff2f",
        color4: "#00ffe5",
        color5: "#ffa200",
        color6: "#ff00ea"
    };

    // Đảm bảo các icon tick trong box màu đều ẩn ban đầu
    colorIds.forEach(id => {
        const el = document.getElementById(id);
        const icon = el.querySelector("i");
        if (icon) {
            icon.classList.add("d-none");
        }
    });

    // Đảm bảo tick hình ảnh cũng ẩn ban đầu (nếu có)
    imageIds.forEach(id => {
        const el = document.getElementById(id);
        const icon = el.querySelector("i");
        if (icon) {
            icon.classList.add("d-none");
        }
    });

    // Lấy giá trị mặc định từ phần color1 và img1
    let selectedBackdrop = document.querySelector("#img1 img").src;
    let selectedColor = colorMap["color1"];

    // --- Xử lý chọn hình nền ---
    imageIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            // Ẩn tick cho tất cả các hình
            imageIds.forEach(imgId => {
                const icon = document.querySelector(`#${imgId} i`);
                if(icon) icon.classList.add("d-none");
            });
            // Hiển thị tick của hình được chọn
            const iconSelected = el.querySelector("i");
            if (iconSelected) {
                iconSelected.classList.remove("d-none");
            }
            selectedBackdrop = el.querySelector("img").src;
        });
    });

    // --- Xử lý chọn màu chữ ---
    colorIds.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("click", () => {
            // Ẩn tick cho tất cả các color box
            colorIds.forEach(colorId => {
                const icon = document.querySelector(`#${colorId} i`);
                if(icon) icon.classList.add("d-none");
            });
            // Kiểm tra xem box hiện tại có <i> chưa, nếu chưa tạo mới rồi append
            let icon = el.querySelector("i");
            if (!icon) {
                icon = document.createElement("i");
                icon.className = "fa-solid fa-circle-check";
                el.appendChild(icon);
            }
            icon.classList.remove("d-none");

            // Lấy giá trị màu chữ theo map
            selectedColor = colorMap[id];
        });
    });

    // --- Xử lý tạo board mới ---
    createBtn.addEventListener("click", () => {
        const title = boardTitleInput.value.trim();
        if (!title) {
            boardTitleValid.style.color = "red";
            return;
        } else {
            boardTitleValid.style.color = "transparent";
        }

        const remembered = JSON.parse(localStorage.getItem("rememberUser")) || JSON.parse(sessionStorage.getItem("sessionUser"));
        const data = JSON.parse(localStorage.getItem("data")) || { users: [] };
        const currentUser = data.users.find(u => u.email === remembered.email);

        const newBoard = {
            id: Date.now(),  // Có thể thay bằng hàm tạo ID tự tăng nếu cần
            title,
            description: "",
            backdrop: selectedBackdrop,
            color: selectedColor, // màu chữ cho board
            is_starred: false,
            is_closed: false,
            created_at: new Date().toISOString(),
            lists: []
        };

        // Thêm board mới vào danh sách của user hiện tại
        currentUser.boards.push(newBoard);
        localStorage.setItem("data", JSON.stringify(data));

        // Đóng modal và reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalCreate"));
        modal.hide();
        boardTitleInput.value = "";

        // Cập nhật lại danh sách board trên dashboard
        displayDashBroads(data, remembered);
    });
}

