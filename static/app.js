$conatiner = $(".cupcake-container");
$formConatiner = $(".form-container");

const BASEURL = "https://cupcake-api.herokuapp.com/";

$formConatiner.hide()

// Gets cupcakes from cupcake API
async function getCupcakes() {
  const response = await axios.get(`${BASEURL}/api/cupcakes`);
  const cupcakes = response.data.results.map((results) => results);

  createCupcakeStory(cupcakes);

}

// For each cupcake, this builds the HTML, jQuery appends to DOM
const createCupcakeStory = (data) => {
  for (let cupcake of data) {
    const $item = $(`
        <div class="cake">
            <section class="image">
                <img src="${cupcake.image}" alt="cupcake image">
            </section>
            <section class="data">
                <p>Flavor: ${cupcake.flavor}</p>
                <p>Size: ${cupcake.size}</p>
                <small>Rating: ${cupcake.rating}/10</small>
                <div class="btn-acts" data-id=${cupcake.id}>
                    <button class="btn" id="edit">Edit</button>
                    <button class="btn" id="delete">Delete</button>
                 </div>
            </section>
        </div>
        `);
    $conatiner.append($item);
  }
};

// Builds the edit form with the current values populating
const showEditForm = (data) => {
  const $item = $(`
    <form>
        <h3>Add Cupcake!</h3>
        <div class="input-container">
            <label for="flavor">Flavor:</label>
            <input type="text" name="flavor" value="${data.flavor}" id="flavor">
        </div>
        <div class="input-container">
            <label for="size">Size:</label>
            <input type="text" name="size" value="${data.size}" id="size">
        </div>
        <div class="input-container">
            <label for="rating">Rating:</label>
            <input type="text" name="rating" value="${data.rating}" id="rating">
        </div>
        <div class="input-container">
            <label for="image">Image URL:</label>
            <input type="text" name="image" value="${data.image}" id="image">
        </div>
        <div class="btn-acts-form" data-id="${data.id}">
            <button class="btn" id="cancel">Cancel</button>
            <button class="btn" id="send">Submit</button>
        </div>
    </form>
    `);
  $formConatiner.append($item);
};

// Basic edit form for when a user wants to add a cupcake.
const editForm = () => {
  const $item = $(`
    <form>
        <h3>Add Cupcake!</h3>
        <div class="input-container">
            <label for="flavor">Flavor:</label>
            <input type="text" name="flavor" id="flavor" required>
        </div>
        <div class="input-container">
            <label for="size">Size:</label>
            <input type="text" name="size" id="size" required>
        </div>
        <div class="input-container">
            <label for="rating">Rating:</label>
            <input type="text" name="rating" id="rating" required>
        </div>
        <div class="input-container">
            <label for="image">Image URL:</label>
            <input type="text" name="image" id="image">
        </div>
        <div class="btn-acts-form">
            <button class="btn" id="cancel">Cancel</button>
            <button class="btn" id="submit">Submit</button>
        </div>
    </form>
    `);
  $formConatiner.append($item);
};

// Event handler - Edit Cupcake
$conatiner.on("click", "#edit", async (evt) => {
  evt.preventDefault()
  const id = $(evt.target).parent().data("id");

  const response = await axios.get(`${BASEURL}/api/cupcakes/${id}`);

  showEditForm(response.data.results)

  $conatiner.hide();
  $formConatiner.show()
});

// Event Handler - Cancel Edit
$formConatiner.on('click', '#cancel', (evt) => {
  evt.preventDefault()
  $formConatiner.empty()
  $formConatiner.hide()
  $conatiner.show()
})

// Event Handler - Submit edit
$formConatiner.on('click', '#send', async (evt) => {
  evt.preventDefault()

  const id = $(evt.target).parent().data('id')
  const flavor = $('#flavor').val()
  const size = $('#size').val()
  const rating = $('#rating').val()
  const image = $('#image').val()

  await axios({
    method: 'PATCH',
    url: `${BASEURL}/api/cupcakes/${id}`,
    data: {
      flavor: flavor,
      size: size,
      rating: rating,
      image: image
    }
  })

  $formConatiner.hide()
  $formConatiner.empty()
  $conatiner.empty()
  getCupcakes()
  $conatiner.show()
})

// Event Handler - Delete cupcake
$conatiner.on('click', '#delete', async (evt) => {
  evt.preventDefault()
  const id = $(evt.target).parent().data('id')
  await axios({
    method: 'DELETE',
    url: `${BASEURL}/api/cupcakes/${id}`
  })
  $conatiner.empty()
  getCupcakes()
})

$('#add').on('click', (evt) => {
  evt.preventDefault()

  editForm()

  $conatiner.hide();
  $formConatiner.show()
})

// Event Handeler - Add cupcake
$formConatiner.on('click', '#submit', async (evt) => {
  evt.preventDefault()
  const flavor = $('#flavor').val()
  const size = $('#size').val()
  const rating = $('#rating').val()
  const image = $('#image').val()

  if (image.length === 0) {
    await axios({
      method: 'POST',
      url: `${BASEURL}/api/cupcakes`,
      data: {
        flavor: flavor,
        size: size,
        rating: rating
      }
    })
  } else {
    await axios({
      method: 'POST',
      url: `${BASEURL}/api/cupcakes`,
      data: {
        flavor: flavor,
        size: size,
        rating: rating,
        image: image
      }
    })
  }

  $formConatiner.hide()
  $formConatiner.empty()
  $conatiner.empty()
  getCupcakes()
  $conatiner.show()
})

getCupcakes();