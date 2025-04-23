const signInBtn = document.getElementById("sign-in-btn");
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

// Hàm thông báo đăng nhập thành công
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

signInBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    alertBox.innerHTML = "";

    let errors = []; // Mảng chứa các lỗi để hiển thị nhiều lỗi cùng lúc

    if (!email) {
        errors.push("Email không được để trống");
    }

    if (!password) {
        errors.push("Mật khẩu không được để trống");
    }

    if (errors.length > 0) {
        showError(errors.join("<br>"));
        return;
    }
    
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra có người dùng trùng khớp không
    const findUser = users.find(user => user.email === email && user.password === password);

    if (findUser) {
        // Nếu người dùng chọn rememberMe thì lưu thông tin vào localStorage
        if (rememberMe) {
            localStorage.setItem("rememberUser", JSON.stringify({ email, password }));
        } else {
            localStorage.removeItem("rememberUser");
        }

        showSuccess("Đăng nhập thành công");
        setTimeout(() => {
            location.href = "../dashboard.html";
        }, 2000);
    } else {
        showError("Email hoặc mật khẩu không hợp lệ");
    }
});

const remembered = JSON.parse(localStorage.getItem("rememberUser"));
if (remembered) {
    location.href = "../dashboard.html";
}
