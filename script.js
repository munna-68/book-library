const closeBtn = document.querySelector(".x-btn")
const formIcon = document.querySelector(".form-icon")
const formContainer = document.querySelector(".form-container")

formIcon.addEventListener('click', (e) => {
  formContainer.classList.toggle("hidden")
})

closeBtn.addEventListener('click', (e) => {
  formContainer.classList.toggle("hidden")
})