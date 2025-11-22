import Swal from "sweetalert2";

export const toastSuccess = (message: string) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
};

export const toastError = (message: string) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
};

export const toastWarning = (message: string) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
};
