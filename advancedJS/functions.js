function greetUser(greeting, userName = 'user') { //파라메터의 기본값 설정하기 
    console.log(greeting +' '+userName);
    console.log(`${greeting} ${userName} !`); //` ` 을 이용한 스트링표현법
}

greetUser('심규원');
greetUser();


function sumUp(...numbers) {  // ...Rest 파라메터, ...을 통해 들어온 입력값들이 배열로 들어옴. 유연성증가
    let result =0;
    for(const number of numbers) {
        result +=number;
    }
    return result;
}

console.log(sumUp(1,2,3,4,5,6)); //굳이 배열을 만들어서 전달해줄 필요가 없음 

const numberArray = [1,2,3,4,5,6];
console.log(sumUp(...numberArray)); // ...이 스프레드 연산자가 되어 배열을 풀어서 전달해줌

console.log(sumUp);