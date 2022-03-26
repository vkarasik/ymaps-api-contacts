window.onload = function () {
  let addressData;

  async function getData() {
    let data = await fetch('data.json');
    return data;
  }

  console.log(getData());

  getData()
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      addressData = result;
    });

  // Дождёмся загрузки API и готовности DOM
  ymaps.ready(init);

  // Инициализация карты
  function init() {
    // Создание экземпляра карты и его привязка к контейнеру с заданным id ("map").
    myMap = new ymaps.Map('map', {
      center: [53.902496, 27.561481],
      zoom: [11],
      controls: ['zoomControl'],
      scroll: false
    });
    myMap.behaviors.disable('scrollZoom');

    placeAllMarks(); // Разместим все метки при загрузке карты
  }

  const buttons = document.querySelectorAll('.location-btn');
  for (let button of buttons) {
    if (button.id == 'show-all') {
      button.addEventListener('click', placeAllMarks, true);
    } else {
      button.addEventListener('click', placeMarks, false);
    }
  }

  function placeMarks(e) {
    hideMarks();
    const id = e.target.id ? e.target.id : e.target.parentElement.id;
    const addressObj = addressData[id];
    const shops = addressObj.shops;
    // Помещаем метки на карту
    for (let address of shops) {
      let mark = new ymaps.Placemark(
        address.coordinates,
        address.properties,
        addressObj.options
      );
      myMap.geoObjects.add(mark);
    }
    buttons.forEach((btn) => btn.classList.remove('location-btn_active'));
    document.getElementById(id).classList.add('location-btn_active');
  }

  function hideMarks() {
    myMap.geoObjects.removeAll(); // Очистим все метки
  }

  function placeAllMarks() {
    hideMarks();
    for (let key in addressData) {
      for (let address of addressData[key].shops) {
        let mark = new ymaps.Placemark(
          address.coordinates,
          address.properties,
          addressData[key].options
        );
        myMap.geoObjects.add(mark);
      }
    }
    buttons.forEach((btn) => btn.classList.remove('location-btn_active'));
  }
};
