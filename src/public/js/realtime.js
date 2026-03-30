const socket = io();

const form = document.getElementById("productForm");
const list = document.getElementById("productList");

socket.on("products", products => {
  list.innerHTML = "";

  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button onclick="deleteProduct(${p.id})">Eliminar</button>
    `;
    list.appendChild(li);
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  socket.emit("addProduct", { title, price });

  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
