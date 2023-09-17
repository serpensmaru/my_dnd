import Card from './card';

export default class CardManager {
  constructor() {
    this.container = null;
    this.actualElement = null;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.eventCardMove = this.eventCardMove.bind(this);

    this.actualElementClone = null;
  }
  // здесь взаимодействие с кнопками в колонке и между колонок

  bindToDOM(container) {
    this.container = container;

    //  поlписываемся на событие нажатия +add another card
    this.eventListenerAdd('todo');
    this.eventListenerAdd('progress');
    this.eventListenerAdd('done');

    // это событие не будет работать над клоном
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
  }

  // событие нажатия на +add anoter card
  eventListenerAdd(col) { // col = todo progress done
    const element = this.container.querySelector(`.an_card_add_${col}`);

    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCard(col);
    });
  }

  addCard(col) { // метод запихивания карточки в определенную колонку
    const add = this.container.querySelector(`.an_card_add_${col}`);
    add.classList.add('hidden');

    const addbtn = this.container.querySelector(`.card_add_${col}`);// скрыть +add и показать кнопку
    addbtn.classList.remove('hidden');

    // событие при нажатии+создать карту взять ее айди,положить колумн,показать кнопку добавить
    const newcard = new Card(col);
    newcard.createCard(col);

    this.eventListenerAddButton(col, newcard);
    //
  }

  // событие нажатия на зеленую add card
  eventListenerAddButton(col, newcard) {
    const element = this.container.querySelector(`.card_add_${col}`);
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCardButon(col, newcard);
    });
  }

  addCardButon(col, newcard) { // скрыть кнопку и показать +add anoter card
    const add = this.container.querySelector(`.an_card_add_${col}`);
    add.classList.remove('hidden');

    const addbtn = this.container.querySelector(`.card_add_${col}`);
    addbtn.classList.add('hidden');

    newcard.saveCard();// сохранить карточку если не пустая

    // newcard это объект, надо присвоить саму карточку в разметке
    const { card } = newcard;

    card.addEventListener('mouseover', (e) => { // событие наведения на карточку
      e.preventDefault();
      this.showClose(card, newcard);
    });

    card.addEventListener('mouseout', (e) => { // событие ушли с карточки
      e.preventDefault();
      this.hiddenClose(card);
    });

    card.addEventListener('mousedown', (e) => { // событие пертаскивания карточки
      e.preventDefault();
      this.actualElement = document.querySelector(`.data-id_${newcard.id}`);
      this.eventCardMove(e);
    });
  }

  showClose(card, newcard) { // показать крестик
    const close = card.querySelector('.card_delete');
    close.classList.remove('hidden');

    close.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close, newcard);
    });
  }

  closeClick(card, close, newcard) { // клик по крестику-> удалить карточку
    card.remove();
    // отписываемся от всех событий на карточке и крестике
    card.removeEventListener('mouseover', (e) => { // событие наведения на карточку
      e.preventDefault();
      this.showClose(card);
    });

    card.removeEventListener('mouseout', (e) => { // событие ушли с карточки
      e.preventDefault();
      this.hiddenClose(card);
    });

    card.removeEventListener('mousedown', (e) => { // событие пертаскивания карточки
      e.preventDefault();
      this.actualElement = document.querySelector(`.data-id_${newcard.id}`);
      this.eventCardMove(e);
    });

    close.removeEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  hiddenClose(card) { // скрыть крестик
    const close = card.querySelector('.card_delete');
    close.classList.add('hidden');

    close.removeEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  // событие перетаскивания карточки
  eventCardMove(e) {
    // this.actualElement = document.querySelector(`.data-id_${id}`);
    // Метод getBoundingClientRect() возвращает объект DOMRect,
    // который содержит размеры элемента и его положение относительно видимой области просмотра.
    // Если из координат курсора мыши (e.clientX и e.clientY) вычесть положение элемента,
    // то можно получить внутреннее положение курсора и клика.
    const elemPosition = this.actualElement.getBoundingClientRect();
    this.cursorX = e.clientX - elemPosition.left;
    this.cursorY = e.clientY - elemPosition.top;

    this.actualElement.classList.add('dragged');// делаем карточку перетаскиваемой
    document.body.style.cursor = 'grabbing';// изменить курсор,в css браузер подменяет его

    document.documentElement.addEventListener('mouseover', this.onMouseOver);
  }

  onMouseOver(e) {
    this.actualElement.style.left = `${e.pageX - this.cursorX}px`;
    this.actualElement.style.top = `${e.pageY - this.cursorY}px`;

    this.actualElementClone = this.actualElement.cloneNode(true);// копия карточки
    // Эту копию затем можно вставить на страницу с помощью методов
    // prepend, append, appendChild, insertBefore или insertAdjacentElement.
    this.actualElementClone.querySelector('.card_input').className = 'card_clone_input';// стилизуем копию
    this.actualElementClone.className = 'card_clone';

    const { target } = e;
    // console.log(`0${target}`);

    const targetColumn = target.closest('.column-item');
    // console.log(`1${target.closest('.card_content')}`);
    // console.log(`2${targetColumn}`);
    if (target.closest('.card_content')) {
      if (document.querySelector('.card_clone') !== null) {
        document.querySelector('.card_clone').remove();
      }
      target.closest('.cards').insertBefore(this.actualElementClone, target.closest('.card_content'));
      // родитель.insertBefore(элемент, перед кем вставить)
    } else if (targetColumn !== null) {
      if (document.querySelector('.card_clone') !== null) {
        document.querySelector('.card_clone').remove();
      }
      targetColumn.querySelector('.cards').appendChild(this.actualElementClone);
      // добавляет узел в конец списка дочерних элементов указанного родительского узла
    } else if (!target.closest('.card_content')
    && !target.closest('.column-item')
    && document.querySelector('.card_clone') !== null) {
      document.querySelector('.card_clone').remove();
    }

    if (this.actualElementClone !== null) {
      this.actualElementClone.addEventListener('mouseup', this.onMouseUp);
      // поскольку обычное 'mouseup' на документе не работает над клоном,
      // подписываемся отдельно на 'mouseup' на клоне
    }
  }
  //

  onMouseUp(e) {
    const { target } = e;

    // const actual = document.querySelector('.dragged');
    // console.log(`5${actual}`);

    if (document.querySelector('.dragged') !== null) {
      // console.log(`4${target}`);
      const targetColumn = target.closest('.column-item');
      const targetClone = target.closest('.card_clone');
      // мы внутри колонки
      if (targetColumn !== null) {
        targetColumn.querySelector('.cards').insertBefore(this.actualElement, this.actualElementClone);

        document.querySelector('.card_clone').remove();

        this.actualElement.classList.remove('dragged');
        this.actualElement = undefined;

        document.body.style.cursor = 'auto';
        this.actualElementClone.removeEventListener('mouseup', this.onMouseUp);

        document.documentElement.removeEventListener('mouseover', this.onMouseOver);
        return;
      }
      // мы над клоном
      // почему то мы над клоном не означает что мы в колонке. почему??
      // клон не считается частью документа, видимо дело в этом
      if (targetClone !== null) {
        const place = document.elementFromPoint(e.clientX, e.clientY);
        // place.closest('.cards').insertBefore(this.actualElement, this.actualElementClone);

        if (place.closest('.card_content')) {
          place.closest('.cards').insertBefore(this.actualElement, place.closest('.card_content'));
          // родитель.insertBefore(элемент, перед кем вставить)
        } else {
          place.closest('.cards').appendChild(this.actualElement);
          // добавляет узел в конец списка дочерних элементов указанного родительского узла
        }

        document.querySelector('.card_clone').remove();
        this.actualElement.classList.remove('dragged');
        this.actualElement = undefined;

        document.body.style.cursor = 'auto';
        this.actualElementClone.removeEventListener('mouseup', this.onMouseUp);

        document.documentElement.removeEventListener('mouseover', this.onMouseOver);
        return;
      }

      this.actualElement.classList.remove('dragged');
      this.actualElement = undefined;

      document.body.style.cursor = 'auto';
      this.actualElementClone.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mouseover', this.onMouseOver);
    }
  }
}
