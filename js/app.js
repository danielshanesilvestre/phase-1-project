let posts = [];

function renderReply(parent, reply) {
  let reply_li = document.createElement("li");
  parent.append(reply_li);

  let reply_text = document.createElement("div");
  reply_text.classList.add("reply-text");
  reply_text.textContent = reply.text;
  reply_li.append(reply_text);
}


function onSubmitReply(event) {
  event.preventDefault();

  let post_id = event.target.parentElement.getAttribute("data-post-id");
  let post = posts.find((post) => {
    return post.id === post_id;
  });

  console.log(post);

  let reply_textarea = event.target.querySelector("textarea.reply-form-text");

  let new_reply = {
    text: reply_textarea.value
  };

  const configuration = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      replies: [...post.replies, new_reply],
    })
  };

  fetch(`http://localhost:3000/posts/${post_id}`, configuration)
      .then(response => response.json())
      .then(data => {
        // Render new reply
        let replies_ul = event.target.parentElement.querySelector("ul.replies");
        renderReply(replies_ul, data.replies[data.replies.length - 1]);

        let replies_count = event.target.parentElement.querySelector("span.reply-count");
        replies_count.textContent = `${data.replies.length} replies `

        let toggle_replies = event.target.parentElement.querySelector("button.toggle-replies");
        toggle_replies.removeAttribute("hidden");
      });
}

function onClickReply(event) {
  let replies = event.target.parentElement.querySelector("ul.replies");
  let reply_form = event.target.parentElement.querySelector("form.reply-form");

  if (reply_form === null)
  {
    event.target.textContent = "Cancel";

    let reply_form = document.createElement("form");
    reply_form.classList.add("reply-form");
    event.target.parentElement.insertBefore(reply_form, replies);
    reply_form.addEventListener("submit", onSubmitReply);

    let textarea = document.createElement("textarea");
    textarea.classList.add("reply-form-text");
    reply_form.append(textarea);

    let br = document.createElement("br");
    reply_form.append(br);

    let submit_reply = document.createElement("input");
    submit_reply.classList.add("reply-submit");
    submit_reply.setAttribute("type", "submit");
    submit_reply.setAttribute("value", "Submit");
    reply_form.append(submit_reply);
  } else {
    event.target.textContent = "Reply";
    reply_form.remove();
  }
}

function onClickToggleReplies(event) {
  let replies = event.target.parentElement.querySelector("ul.replies");

  if (replies.hasAttribute("hidden")) {
    replies.removeAttribute("hidden");
    event.target.textContent = "Hide";
  } else {
    replies.setAttribute("hidden", "");
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
        posts.push(data);
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
  toggle_replies.classList.add("toggle-replies");
  toggle_replies.textContent = "Hide";
  if (post.replies.length === 0) {
    toggle_replies.setAttribute("hidden", "true");
  }
  li.append(toggle_replies);
  toggle_replies.addEventListener("click", onClickToggleReplies);

  let reply_button = document.createElement("button");
  reply_button.textContent = "Reply";
  li.append(reply_button);
  reply_button.addEventListener("click", onClickReply);

  let replies = document.createElement("ul");
  replies.classList.add("replies");
  li.append(replies);

  post.replies.forEach((reply) => {
    renderReply(replies, reply);
  });
}

function onDOMContentLoaded() {
  let post_form = document.getElementById("post-form");
  post_form.addEventListener("submit", onSubmitPost);

  fetch("http://localhost:3000/posts")
      .then(response => response.json())
      .then(data => {
        posts = data;

        posts.forEach((post) => {
          renderPost(post);
        })
      })
      .catch(error => console.log(error));

}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);