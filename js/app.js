
function onSubmitPost(event) {
  event.preventDefault();

  console.log("Form was submitted!");

  let post_form_image = document.getElementById("post-form-image");
  let post_form_subject = document.getElementById("post-form-subject");
  let post_form_body = document.getElementById("post-form-body");

  const configuration = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      
    })
  };

  fetch("http://localhost:3000/posts");

}

function renderPost(post) {
  let feed = document.getElementById("feed");

  let li = document.createElement("li");
  feed.append(li);

  let post_image = document.createElement("img");
  post_image.classList.add("post-image");
  post_image.setAttribute("src", post.image);
  li.append(post_image);

  let post_subject = document.createElement("div");
  post_subject.classList.add("post-subject");
  post_subject.textContent = post.subject;
  li.append(post_subject);

  let post_body = document.createElement("div");
  post_body.classList.add("post-body");
  post_body.textContent = post.body;
  li.append(post_body);
}

function onDOMContentLoaded() {
  let post_form = document.getElementById("post-form");
  post_form.addEventListener("submit", onSubmitPost);

  fetch("http://localhost:3000/posts")
      .then(response => response.json())
      .then(data => {
        console.log(data);

        for (let post of data) {
          renderPost(post);
        }
      })
      .catch(error => console.log(error));

}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);