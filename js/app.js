function onSubmitReply(event) {
  event.preventDefault();

}

function onClickReply(event) {
  let reply_form = document.createElement("form");

  let post_id = event.target.parentElement.getAttribute("data-post-id");
  let fetch_url = `http://localhost:3000/posts/${post_id}`;

  let new_reply = {
    text: "This is a reply??!"
  };

  // This is nested because I don't know how else to do async JS
  fetch(fetch_url)
      .then(response => response.json())
      .then(data => {
        let replies = data.replies;
        replies.push(new_reply);

        const configuration = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            replies: replies,
          })
        };

        fetch(fetch_url, configuration)
            .then(response => response.json())
            .then(data => {
              console.log(data);
            });
      });
}

function onClickToggleReplies(event) {
  let replies = event.target.parentElement.querySelector("ul.replies");

  if (replies.hasAttribute("hidden")) {
    replies.removeAttribute("hidden");
    event.target.textContent = "Hide";
  } else {
    replies.setAttribute("hidden", "true");
    event.target.textContent = "Show";
  }
}

function onSubmitPost(event) {
  event.preventDefault();

  console.log("Form was submitted!");

  let post_form_image = document.getElementById("post-form-image");
  let post_form_subject = document.getElementById("post-form-subject");
  let post_form_body = document.getElementById("post-form-body");

  let request_body = {
    image: post_form_image.value,
    subject: post_form_subject.value,
    body: post_form_body.value,
    replies: []
  };

  const configuration = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(request_body)
  };

  fetch("http://localhost:3000/posts", configuration)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        renderPost(data)
      });

}

function renderPost(post) {
  let feed = document.getElementById("feed");

  let li = document.createElement("li");
  li.setAttribute("data-post-id", `${post.id}`);
  feed.prepend(li);

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

  let replies_count = document.createElement("span");
  replies_count.classList.add("reply-count")
  replies_count.textContent = `${post.replies.length} replies `;
  li.append(replies_count);

  let toggle_replies = document.createElement("button");
  toggle_replies.textContent = "Hide";
  toggle_replies.addEventListener("click", onClickToggleReplies);
  if (post.replies.length === 0) {
    toggle_replies.setAttribute("hidden", "true");
  }
  li.append(toggle_replies);

  let reply_button = document.createElement("button");
  reply_button.textContent = "Reply";
  reply_button.addEventListener("click", onClickReply);
  li.append(reply_button);

  let replies = document.createElement("ul");
  replies.classList.add("replies");
  li.append(replies);

  for (let reply of post.replies) {
    let reply_li = document.createElement("li");
    replies.prepend(reply_li);

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