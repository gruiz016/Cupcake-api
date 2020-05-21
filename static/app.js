$conatiner = $('.cupcake-container')

const BASEURL = 'http://127.0.0.1:5000/'

async function getCupcakes() {
    const response = await axios.get(`${BASEURL}/api/cupcakes`)
    const cupcakes = response.data.results.map((results) => results)

    createCupcakeStory(cupcakes)
}

const createCupcakeStory = (data) => {
    for (let cupcake of data) {
        const $item = $(`
        <div class="cake" data-id=${cupcake.id}>
            <section class="image">
                <img src="${cupcake.image}" alt="cupcake image">
            </section>
            <section class="data">
                <p>Flavor: ${cupcake.flavor}</p>
                <p>Size: ${cupcake.size}</p>
                <small>Rating: ${cupcake.rating}/10</small>
                <div class="btn-acts">
                    <button class="btn" id="edit">Edit</button>
                    <button class="btn" id="delete">Delete</button>
                 </div>
            </section>
        </div>
        `)
        $conatiner.append($item)
    }
}

getCupcakes()