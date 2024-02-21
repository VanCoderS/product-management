const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');

if (buttonsChangeStatus.length > 0) {
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      const statusCurrent = button.getAttribute('data-status');
      const statusChanged = statusCurrent === 'active' ? 'inactive' : 'active';

      const formChangeStatus = document.querySelector('[form-change-status]');
      if (formChangeStatus) {
        const path =
          formChangeStatus.getAttribute('data-path') +
          `/${statusChanged}/${id}?_method=PATCH`;
        formChangeStatus.action = path;
        formChangeStatus.submit();
      }
    });
  });
}

const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector('[form-delete-item]');
  if (formDeleteItem) {
    const path = formDeleteItem.getAttribute('data-path');
    buttonsDelete.forEach((button) => {
      button.addEventListener('click', (e) => {
        const title = button.getAttribute('data-title');
        const isConfirm = confirm(`Bạn có muốn xóa sản phẩm ${title}?`);
        if (isConfirm) {
          const id = button.getAttribute('data-id');
          const action = `${path}/${id}?_method=DELETE`;
          formDeleteItem.action = action;
          formDeleteItem.submit();
        }
      });
    });
  }
}
