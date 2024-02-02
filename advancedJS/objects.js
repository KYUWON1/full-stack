//리터럴 객체생성
const job = {
    title : 'Developer',
    location : 'New York',
    salary : 50000
};
const jobTitle = job.title;
const {title = '내 타이틀',location ='이거없으면 복사해옴',salary} = job; // 리터럴객체 비구조화 할당

// console.log(new Date().toISOString()); // 현재 날짜 타임스태프 출력

//블루프린트, 즉 클래스
class Job {
  //클래스 객체
  constructor(jobTitle, place, salary) {
    this.title = jobTitle;
    this.location = place;
    this.salary = salary;
  } //생성자

  describe( ){ // 클래스의 함수 생성
    console.log(
      `I'm ${this.title}, i work in ${this.location}, and i earn ${this.salary}`
    );
  }
}

const developer = new Job("Dev", "한국", 3000); // class 객체 생성
console.log(developer);
developer.describe();

//배열의 사용예시
const input = ['심','규원'];
const firstName = input[0];
const lastName = input[1];
const[first,last] = input; //배열의 비구조화 할당
console.log(first); //심