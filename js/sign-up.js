const signUpBtn = document.getElementById("sign-up-btn");
const alertBox = document.getElementById("alert-box");

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
    // Lấy danh sách người dùng hiện tại từ localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

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
    
    // Thêm người dùng mới
    users.push({ name, email, password });

    // Lưu lại vào localStorage
    localStorage.setItem("users", JSON.stringify(users));

    showSuccess("Đăng ký thành công");
    setTimeout(() => {
        location.href = "sign-in.html";
    }, 2000); // Chuyển hướng sau 2 giây
});

const remembered = JSON.parse(localStorage.getItem("rememberUser"));
if (remembered) {
    location.href = "../dashboard.html";
}