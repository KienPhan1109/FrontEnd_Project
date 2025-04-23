// Nút đăng xuất
document.addEventListener("DOMContentLoaded", () => {
    const signOutBtn = document.getElementById("sign-out-btn");

    if (signOutBtn) {
        signOutBtn.addEventListener("click", (e) => {
            localStorage.removeItem("rememberUser");
            location.href = "./auth/sign-in.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const signOutBtn = document.getElementById("sign-out-btn2");

    if (signOutBtn) {
        signOutBtn.addEventListener("click", (e) => {
            localStorage.removeItem("rememberUser");
            location.href = "./auth/sign-in.html";
        });
    }
});

