function createUserSession(req,user,action) {
    req.session.uid = user._id.toString(); //세션의 유저 id 저장
    req.session.isAdmin = user.isAdmin;
    req.session.save(action); // 저장이 완료된후에 action시행
}

function deleteUserCookie(req) {
  req.session.uid = null;
  //req.session.save(action);  삭제라서 save는 필요없음
}

module.exports = {
  createUserSession: createUserSession,
  deleteUserCookie: deleteUserCookie,
};