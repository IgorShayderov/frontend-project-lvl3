import { Modal } from 'bootstrap';

export default class ModalWindow {
  constructor(selector) {
    const modalNode = document.querySelector(selector);

    if (modalNode) {
      this.modal = new Modal(modalNode);
    } else {
      throw new Error('Invalid selector for modal window');
    }
  }

  show({ title, description, link }) {
    const titleNode = document.querySelector('#postsModalLabel');
    const descriptionNode = document.querySelector('.modal-body');
    const showMoreLink = document.querySelector('.btn-primary a');

    titleNode.textContent = title;
    descriptionNode.textContent = description;
    showMoreLink.setAttribute('href', link);

    this.modal.show();
  }
}
