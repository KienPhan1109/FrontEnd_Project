const signUpBtn = document.getElementById("sign-up-btn");
const alertBox = document.getElementById("alert-box");

// Nếu đã ghi nhớ đăng nhập thì chuyển sang dashboard luôn
const remembered = JSON.parse(localStorage.getItem("rememberUser"));
const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"));

if (remembered || sessionUser) {
    location.href = "../dashboard.html";
}

// Hàm thông báo lỗi
function showError(message) {
    alertBox.innerHTML = `
        <div class="alert-box-error">
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

// Hàm thông báo đăng ký thành công
function showSuccess(message) {
    alertBox.innerHTML = `
        <div class="alert-box-successful">
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

signUpBtn.addEventListener("click", () => {
    // Lấy toàn bộ dữ liệu từ localStorage
    let data = JSON.parse(localStorage.getItem("data")) || {users: []};
    let users = data.users; // Truy xuất người dùng từ data

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let errors = []; // Mảng chứa các lỗi để hiển thị nhiều lỗi cùng lúc

    alertBox.innerHTML = "";

    // Sử dụng biểu thức chính quy để kiểm tra email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    if (!email) {
        errors.push("Email không được để trống");
    } else if (!isValidEmail(email)) {
        errors.push("Email không đúng định dạng");
    } else if (users.some(user => user.email === email)) {
        errors.push("Email đã tồn tại");
    }

    if (!name) {
        errors.push("Họ và tên không được để trống");
    }

    if (!password) {
        errors.push("Mật khẩu không được để trống");
    } else if (password.length < 8) {
        errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }

    if (errors.length > 0) {
        showError(errors.join("<br>"));
        return;
    }
    
    // Tính ID mới tăng dần
    let newId = 1;
    if (users.length > 0) {
        const lastUser = users[users.length - 1];
        newId = lastUser.id + 1;
    }

    // Tạo user mới và thêm vào danh sách users
    const newUser = {
        id: newId,
        username: name,
        email,
        password,
        created_at: new Date().toISOString(),
        boards: []
    };

    users.push(newUser);
    data.users = users;

    // Lưu lại toàn bộ object data
    localStorage.setItem("data", JSON.stringify(data));

    showSuccess("Đăng ký thành công");
    setTimeout(() => {
        location.href = "sign-in.html";
    }, 1000); // Chuyển hướng sau 1 giây
});
