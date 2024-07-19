
function onClickToggleReplies(event) {
  let replies = event.target.parentElement.querySelector("ul.replies");

  if (replies.hasAttribute("hidden")) {
    replies.removeAttribute("hidden");
  } else {
    replies.setAttribute("hidden", "true");
  }
}

function onSubmitReply(event) {
  event.preventDefault();


}


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

  let post_container = document.createElement("div");
  post_container.classList.add("post-container");
  li.append(post_container);

  let post_image = document.createElement("img");
  post_image.classList.add("post-image");
  post_image.setAttribute("src", post.image);
  post_container.append(post_image);

  let post_text = document.createElement("div");
  post_text.classList.add("post-text");
  post_container.append(post_text);

  let post_subject = document.createElement("div");
  post_subject.classList.add("post-subject");
  post_subject.textContent = post.subject;
  post_text.append(post_subject);

  let post_body = document.createElement("div");
  post_body.classList.add("post-body");
  post_body.textContent = post.body;
  post_text.append(post_body);

  let toggle_replies = document.createElement("button");
  toggle_replies.textContent = "Toggle replies";
  toggle_replies.addEventListener("click", onClickToggleReplies);
  li.append(toggle_replies);

  let replies = document.createElement("ul");
  replies.classList.add("replies");
  li.append(replies);

  for (let reply of post.replies) {
    let reply_li = document.createElement("li");
    replies.append(reply_li);

    let reply_image = document.createElement("img");
    reply_image.classList.add("reply-image");
    reply_image.setAttribute("src", reply.image);
    reply_li.append(reply_image);

    let reply_text = document.createElement("div");
    reply_text.classList.add("reply-text");
    reply_text.textContent = reply.text;
    reply_li.append(reply_text);
  }
}

function onDOMContentLoaded() {
  let post_form = document.getElementById("post-form");
  post_form.addEventListener("submit", onSubmitPost);

  fetch("http://localhost:3000/posts")
      .then(response => response.json())
      .then(data => {
        for (let post of data) {
          renderPost(post);
        }
      })
      .catch(error => console.log(error));

}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);