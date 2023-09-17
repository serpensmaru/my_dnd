export default class Card {
  constructor(column) {
    this.container = document.querySelector('.container');

    this.column = column;// здесь будет класс колонки
    this.id = null;// генерится внутри
    this.card = null;// тело карточки
    this.text = null;// текст в ней по селектору
    this.btn = null;// ее крестик по селектору

    this.idReserv = [];
  }

  cardMaP(id) { // здесь взаимодействия и события на самой карточке(кроме перетаскивания)
    this.id = id;
    return `<div class="card_content data-id_${id}">
                <textarea class="card_input" type="text" placeholder="Enter a title for this card"></textarea>
                <button class="card_delete hidden">&#10006;</button>
            </div>`;
  }

  createCard(col) { // метод создания карточки и присвоить ей айди
    const element = this.container.querySelector(`.cards_${col}`);// найти нужную колонку
    this.id = this.generateId();

    element.insertAdjacentHTML('beforeend', this.cardMaP(this.id));// поставить в колонку пустое текстарея
    this.card = element.querySelector(`.data-id_${this.id}`);

    this.text = this.card.querySelector('.card_input').value;
    this.btn = this.card.querySelector('.card_delete');
  }

  saveCard() {
    this.text = this.card.querySelector('.card_input').value;
    if (this.text === '') { // не пустое ли значение
      this.delete(this.card);
    }

    this.card.querySelector('.card_input').blur();// убирает фокус
  }
  // там же подписаться на событие навести на карту и функция показать крестик
  // в функции показать крестик - убрать хидден подписаться на событие нажать - функ удалить карту

  delete() { // метод удаления карточки
    this.card.remove();
  }

  // генерация айдишника
  // с data-id не получилось, опознаю по классу data-id_~циферки~
  generateId() {
    const id = Math.floor(Math.random() * 1000000);
    if (this.idReserv.includes(id)) {
      return this.generateId();
    }
    this.idReserv.push(id);
    return id;
  }
}
