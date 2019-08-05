function readJsonFile(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

readJsonFile('results.json', function(text) {
  const dataBase = JSON.parse(text);
  const posts = dataBase.posts;
  console.log(posts);
  posts.forEach(post => createPost(post));
  const options = document.querySelectorAll('.item__list-options');
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < options.length; j++) {
      posts[i]['options'] && i === j ? createOptions(posts[i]['options'], options[j]) : null;
    }
  }
  const skills = document.querySelectorAll('.item__list-skills');
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < skills.length; j++) {
      posts[i]['skills'] && i === j ? createSkills(posts[i]['skills'], skills[j]) : null;
    }
  }
});

function createPost(object) {
  const parentList = document.querySelector('.results__list');
  const post = `<li class="results__item">
            <h3 class="item__heading">${object.name}</h3>
                <ul class="item__list-options item__list">
                </ul>   
                <p class="item__text">${object.description}</p>
                <span class="more"><span>
                <div class="item__list-wrapper">
                    <div class="item__category">
                        <span class="item-title">Category</span>
                        ${object.category}
                    </div>
                    <ul class="item__list-skills item__list">
                    </ul>
                    <span class="more"><span>
                </div>
                <div class="item__list-wrapper">
                    <div class="item__client">
                        <span class="item-title">Client</span>
                        ${object.client.country}
                    </div>
                    <span class="item__rating">${object.client.rating}</span>
                    <div class="item__rating--img">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                </li>`;
  parentList.innerHTML += post;
}

function createOptions(object, parent) {
  for (let [key, value] of Object.entries(object)) {
    key === 'budget' ? (value = `$${value}`) : value;
    const postElement = `
          <li class="item__option">
              <span class="item-title">${key}</span>
              <span class="item-value">${value}</span>
          </li>
          `;
    parent.innerHTML += postElement;
  }
}

function createSkills(array, parent) {
  array.forEach(element => {
    const postElement = `<li class="item__skills">${element.name}</li>`;
    parent.innerHTML += postElement;
  });
}
