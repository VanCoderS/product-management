const buttonsStatus = document.querySelectorAll('[button-status]');
const formSearch = document.querySelector('#form-search');
const buttonsPagination = document.querySelectorAll('[button-pagination]');

if (buttonsStatus.length > 0) {
  buttonsStatus.forEach((button) => {
    button.addEventListener('click', (e) => {
      const status = button.getAttribute('button-status');
      const url = new URL(window.location.href);
      if (status) {
        url.searchParams.set('status', status);
      } else {
        url.searchParams.delete('status');
      }
      window.location.href = url.href;
    });
  });
}

if (formSearch) {
  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set('keyword', keyword);
    } else {
      url.searchParams.delete('keyword');
    }
    window.location.href = url.href;
  });
}

if (buttonsPagination.length > 0) {
  buttonsPagination.forEach((button) => {
    button.addEventListener('click', (e) => {
      const page = button.getAttribute('button-pagination');
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      window.location.href = url.href;
    });
  });
}

const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='check-all']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  if (inputCheckAll) {
    inputCheckAll.addEventListener('click', (e) => {
      if (e.target.checked) {
        inputsId.forEach((input) => (input.checked = true));
      } else {
        inputsId.forEach((input) => (input.checked = false));
      }
    });
  }

  inputsId.forEach((input) => {
    input.addEventListener('click', (e) => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked === inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputsId = document.querySelectorAll("input[name='id']:checked");
    if (inputsId.length > 0) {
      if (e.target.elements.type.value === 'delete-all') {
        const isConfirm = confirm('Bạn có muốn xóa sản phẩm này?');
        if (!isConfirm) {
          return;
        }
      }
      const ids = [];
      inputsId.forEach((input) => {
        const id = input.value;
        if (e.target.elements.type.value === 'change-position') {
          const position = input
            .closest('tr')
            .querySelector("[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      const inputIds = document.querySelector("input[name='ids']");
      inputIds.value = ids.join(', ');
      formChangeMulti.action = formChangeMulti.getAttribute('data-path');
      formChangeMulti.submit();
    } else {
      alert('Vui lòng chọn ít nhất một sản phẩm!');
    }
  });
}

const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
  const time = parseInt(showAlert.getAttribute('data-time'));
  const closeAlert = document.querySelector('[close-alert]');
  setTimeout(() => {
    showAlert.classList.add('alert-hidden');
  }, time);

  closeAlert.addEventListener('click', (e) => {
    showAlert.classList.add('alert-hidden');
  });
}

const containerImagePreview = document.querySelector(
  '.container-image-preview'
);
if (containerImagePreview) {
  const uploadImageInput = document.querySelector('[upload-image-input]');
  const uploadImagePreview = document.querySelector('[upload-image-preview]');
  if (uploadImagePreview.getAttribute('src').length > 0) {
    const closeImage = document.querySelector('.close-image');
    closeImage.classList.remove('hidden');

    closeImage.addEventListener('click', (e) => {
      uploadImageInput.value = '';
      uploadImagePreview.src = '';
      closeImage.classList.add('hidden');
    });
  }
  if (uploadImageInput) {
    uploadImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadImagePreview.src = URL.createObjectURL(file);
        if (uploadImagePreview.getAttribute('src').length > 0) {
          const closeImage = document.querySelector('.close-image');
          closeImage.classList.remove('hidden');

          closeImage.addEventListener('click', (e) => {
            uploadImageInput.value = '';
            uploadImagePreview.src = '';
            closeImage.classList.add('hidden');
          });
        }
      }
    });
  }
}

const sort = document.querySelector('[sort]');
if (sort) {
  const sortSelect = sort.querySelector('[sort-select]');
  const sortClear = sort.querySelector('[sort-clear]');
  const url = new URL(window.location.href);

  sortSelect.addEventListener('change', (e) => {
    const [sortKey, sortValue] = e.target.value.split('-');
    url.searchParams.set('sortKey', sortKey);
    url.searchParams.set('sortValue', sortValue);

    window.location.href = url.href;
  });

  sortClear.addEventListener('click', (e) => {
    url.searchParams.delete('sortKey');
    url.searchParams.delete('sortValue');

    window.location.href = url.href;
  });

  const sortKey = url.searchParams.get('sortKey');
  const sortValue = url.searchParams.get('sortValue');
  const value = `${sortKey}-${sortValue}`;
  const option = sortSelect.querySelector(`option[value='${value}']`);
  if (option) {
    option.setAttribute('selected', true);
  }
}

const buttonChangeDelete = document.querySelectorAll('[button-change-delete]');
if (buttonChangeDelete.length > 0) {
  const formChangeDelete = document.querySelector('[form-change-delete]');
  buttonChangeDelete.forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      const path = `${formChangeDelete.getAttribute(
        'data-path'
      )}/${id}?_method=PATCH`;
      formChangeDelete.action = path;
      formChangeDelete.submit();
    });
  });
}

const buttonDeleteForever = document.querySelectorAll(
  '[button-delete-forever]'
);
if (buttonDeleteForever.length > 0) {
  const formDeleteItemForever = document.querySelector(
    '[form-delete-item-forever]'
  );
  buttonDeleteForever.forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      const title = button.getAttribute('data-title');
      const isConfirm = confirm(
        `Bạn chắc chắn muốn xóa luôn sản phẩm ${title}?`
      );
      if (isConfirm) {
        const path = `${formDeleteItemForever.getAttribute(
          'data-path'
        )}/${id}?_method=DELETE`;
        formDeleteItemForever.action = path;
        formDeleteItemForever.submit();
      }
    });
  });
}
