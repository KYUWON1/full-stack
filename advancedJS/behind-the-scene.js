const hobbies = ['sports', 'cooking']; //원시값과 참조값, 배열을 생성하면 주소값이 생성됨
hobbies.push('reading');

console.log(hobbies);

const person = {age:32}; //객체
function getYears(p) { // 객체를 참조
    p.age -=18;
    return p.age;
    //return p.age-18; 이렇게하면 객체를 변경하지않고 값만 리턴됨 14, 32 출력
}

console.log(getYears(person));
console.log(getYears({...person}));//스프레드 ... 를 통해 person객체를 풀어서 새로운 객체로 전달해줌
console.log(person); // 객체를 참조했기 때문에 p가 아닌 person의 age도 14로 바뀜