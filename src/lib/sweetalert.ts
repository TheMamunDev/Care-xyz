import Swal, { SweetAlertIcon } from 'sweetalert2';

interface ConfirmActionOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const confirmAction = async ({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  icon = 'warning',
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'Cancel',
}: ConfirmActionOptions = {}): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#E76F51', // Primary color from theme
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
