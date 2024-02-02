const loadCommentBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentFormElement = document.querySelector("#comments-form form"); //comment-form의 form태그에 접근
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

//PUT   PATCH  DELETE 개념이 존재
function createComment(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
       <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
        </article>
        `;
    commentListElement.appendChild(commentElement);
  }
  return commentListElement;
}

async function fetchComment() {
  const postId = loadCommentBtnElement.dataset.postid;
  console.log(postId);
  const response = await fetch(`/posts/${postId}/comments`);

  //에러처리해보기
  const resData = await response.json();

  if (resData && resData.length > 0) {
    const commentListElement = createComment(resData);
    commentsSectionElement.innerHTML = "";
    commentsSectionElement.appendChild(commentListElement);
  }
  else{
    commentsSectionElement.firstElementChild.textContent =
    '댓글이 존재하지 않습니다!';
  }
  
}

//ajax를 통해 데이터 추가하기
async function saveComment(event) {
  event.preventDefault(); //페이지 전송을 막음
  const postId = commentFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = { title: enteredTitle, text: enteredText };

  try{
    //서버측에 전송,미들웨어를 처리해도, header에서 json이라고 명시해줘야 해당 미들웨어를 통과함
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    }); //기본값은 GET ,POST로 설정해줌

    //에러처리부분
    if (response.ok) {
    } //200, 201 ,300 을 받으면 성공, 400, 500 에러캐치 서버에러 
    else {
      alert("댓글 전송 실패!");
    }

    //호출해서 reload
    fetchComment();
  }catch(error){
    alert('요청전송실패!'); // 400 500에러외에도  요청 자체에서 실패했을때, 장치에러
  }
  
}

loadCommentBtnElement.addEventListener("click", fetchComment);
commentFormElement.addEventListener("submit", saveComment);
