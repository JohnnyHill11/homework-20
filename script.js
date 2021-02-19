'use strict';

const STICKERS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';
const DELETE_BUTTON_CLASS = 'delete-button';
const LIST_STICKERS_ITEM_SELECTOR = '.list-stickers-item';
const TEXT_CONTENT_CLASS = 'text-content;'

const $buttonAdd = $('#button-id');
const $stickersList = $('#stickers-id');
const $stickersListTemplate = $('#list-stickers-template').html();

let stickerList = []

$buttonAdd.on('click', onButtonClick);
$stickersList.on('click', onStickerListClick);
$stickersList.on('focusout', onStickerListFocusout)


function onButtonClick() {
	createSticker()
}

function onStickerListClick(event) {
  const stickerElement = getStickerElement(event.target)
  if(event.target.classList.contains(DELETE_BUTTON_CLASS)) {
    deleteSticker(stickerElement.dataset.id);
  }
}

function onStickerListFocusout(event) {
  const stickerElement = getStickerElement(event.target)
  if(!event.target.classList.contains(TEXT_CONTENT_CLASS)) {
    updateSticker(stickerElement.dataset.id);
	}
}

function createSticker(sticker) {
  fetch(STICKERS_URL, {
		method : 'POST',
    body: JSON.stringify(sticker),
    headers: {
      'Content-Type' : 'application/json',
    },
	})
	.then(response => response.json())
	.then(data => {
    stickerList.push(data);
		renderStickers(stickerList);
  })
}

function deleteSticker(stickerId) {
	stickerList = stickerList.filter((sticker) => sticker.id !== stickerId);
	fetch(STICKERS_URL + stickerId, {
		method : 'DELETE',
	})
	renderStickers(stickerList);
}

function updateSticker(stickerId) {
  const	sticker = stickerList.find((sticker) => sticker.id === stickerId);
	fetch(STICKERS_URL + stickerId, {
		method : 'PUT',
		body: JSON.stringify(sticker),
    headers: {
      'Content-Type' : 'application/json',
    },
	})
  renderStickers(stickerList);
}

function renderStickers(data) {
  const stickerHtml = data.map(getStickerHtml).join('');
  $stickersList.html(stickerHtml);
}

function setStickers(data) {
  return (stickerList = data);
}
function getStickerElement(element) {
  return element.closest(LIST_STICKERS_ITEM_SELECTOR);
}

function getStickerHtml(sticker) {
  return $stickersListTemplate
    .replaceAll('${description}', sticker.description)
    .replaceAll('${id}', sticker.id);
}