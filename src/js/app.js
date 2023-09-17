import CardManager from './cardManager';

const cardManager = new CardManager();

cardManager.bindToDOM(document.querySelector('.container'));
