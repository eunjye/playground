;(function(){

    'use strict';  // this===undefined (strict모드가 아닐 시 this===window)

    /* // [날짜 계산하기]
    var date = new Date(1994, 11, 20);  // 1994/12/20
    date.setDate(date.getDate() - 10);
    console.log(date.getFullYear(), date.toLocaleString());
    */

    /* // [정규 표현식]
    var text = ['ㅁㅁㅁd', 'aa', '이아이이우', '아이이이이이이에에으'];
    var expression = new RegExp(/아이*우/);
    console.log(text[2].match(expression));  // 문자열에 해당하는 패턴이 있으면 그 문자열 반환. 없을 시 null
    console.log(text[2].search(expression));  // 문자열에 해당하는 패턴이 있으면 그 시작 위치(index) 반환. 없을 시 -1.
    console.log(expression.test(text));  // 패턴과 일치하는지 확인 (true/false 반환) : 만약 배열 대상이면 이에 부합하는게 하나라도 있을 때 true, 하나라도 없으면 false
    console.log(expression.exec(text));  // 패턴과 일치할 시 배열 반환. 1: 일치 문자열, 2~ : 정규표현식의 group(괄호). (.input : text의 value들, index: 앞의 다른 요소들의 문자열까지 포함한 시작 index(0부터 시작, 다음 객체로 넘어갈 때 인덱스 +1))
    */

    /* // [생성자]
    function Person(name, gender) {  // this: 생성자 함수 자신을 가리킴
        this.name = name;
        this.gender = gender;
        this.sayHello = function() {
            console.log(`${this.name} said "Hello"`);
        }
    }
    var jihye = new Person('Jihye', 'f');
    var jidol = new Person('Jidol', 'm');
    jihye.sayHello();
    jidol.sayHello();
    */

    /* // [프로토타입 : 플라이급 패턴]
    // 객체마다 동일한 메소드/값을 생성하는 것은 메모리 낭비
    // 따라서 공유될 객체를 하나 만들고, 해당 프로토타입을 참조하여 사용하는 방식 이용
    // 프로토타입이 수정되면 이를 공유하고 있는 객체들도 동일하게 수정되지만,
    // 참조하고 있는 객체의 값을 수정하는 것은 다른 객체에는 영향을 주지 않는다.
    var Person = (function() { // 생성자(constructor) 함수 : 타 언어에서의 class와 유사.
        function makePerson(name) {
            this.name = name; // this는 생성자 함수 자신을 가리킴 (여기선 Person)
        }
        makePerson.prototype.length = 160; 
        makePerson.prototype.weight = 55;
        makePerson.prototype.age = 26;
        makePerson.prototype.sayHello = function() {
            console.log(`내 이름은 ${this.name}, 키는 ${this.length}, 몸무게는 ${this.weight}, 나이는 ${this.age}. 잘 부탁해!`);
        }
        //  // jQuery 확장
        // $.extend(makePerson.prototype, {

        // });
        
        return makePerson;
    })();
    var jihye = new Person('jihye');
    jihye.length += 10;
    jihye.sayHello();  // age: 26
    Person.prototype.age = 49;  // 프로토타입 값 수정
    jihye.sayHello();  // age: 49
    var jidol = new Person('jidol');
    jidol.length -= 10;
    jidol.age -= 10;
    jidol.sayHello();  // age: 39
    jihye.sayHello();  // age: 49
    console.log(jihye, jihye.__proto__);  // 해당 객체를 콘솔에서 열 때 보이는 __proto__는 참조된 생성자의 prototype
    */

    /* // [★프로토타입 상속]
    function Vehicle(name, speed) {
        this.name = name;
        this.speed = speed;
    }
    Vehicle.prototype.drive = function() {
        console.log(`${this.name} runs at ${this.speed}`);
    }
    var tico = new Vehicle('tico', 50);
    tico.drive();  // 'tico runs at 50'
    function Sedan(name, speed, maxSpeed) {
        Vehicle.apply(this, arguments); // Vehicle에 this를 적용(대입). arguments: this의 매개변수. maxSpeed는 Vehicle에 사용되지 않으므로 그냥 놔둠.
        this.maxSpeed = maxSpeed;
    }
    Sedan.prototype = Object.create(Vehicle.prototype);  // Sedan의 proto와 Vehicle의 proto를 연결. => Vehicel의 drive 사용 가능.
    // Object.create는 Vehicle.prototype을 상속하는 새로운 객체를 만듦.
    // 해당 상속한 객체를 Sedan.prototype에 대입하니까 Sedan이 Vehicle을 상속하는 것.
    // 그래서 Vehicle.prototype을 수정하면 Sedan.prototype도 수정되지만,
    // Sedan.prototype을 수정하면 Vehicle.prototype은 수정되지 않는다.
    Sedan.prototype.constructor = Sedan; // proto의 constructor는 생성자 자신을 가리켜야하지만, Object.create로 인한 js의 오류 때문에 자신을 가리키지 않음(여기선 Vehicle()을 가리킴). 이를 수정하기 위한 코드.
    Sedan.prototype.boost = function() {
        console.log(`${this.name} boosts its speed at ${this.maxSpeed}`);
    }
    function Truck(name, speed, capacity) {
        Vehicle.apply(this, arguments);
        this.capacity = capacity;
    }
    Truck.prototype = Object.create(Vehicle.prototype);
    Truck.prototype.constructor = Truck;
    Truck.prototype.load = function(weight) {
        if (weight > this.capacity) {
            console.log('아이고 무거워!');
        } else console.log('짐을 실었습니다.');
    }
    var truckA = new Truck('truck', 80, 250);  // new로 생성자를 호출하면 this는 새로 만들어지는 객체를 가리킴.
    console.log(truckA.capacity);  // 250
    truckA.drive();  // 'truckA runs at 80'
    truckA.load(276);  // '아이고 무거워!'
    var sonata = new Sedan('sonata', 100, 200);
    sonata.drive();  // 'sonata runs at 100'
    sonata.boost();  // 'sonata boosts its speed at 200'
    tico.drive();  // 'tico runs at 50'
    console.log(sonata, tico);
    console.log(Sedan.prototype.constructor === sonata.constructor); // true; Sedan()
    console.log(Sedan.prototype === sonata.__proto__)  // true; prototype : 사용자가 정의한 생성자의 prototype. __proto__ : 객체가 참조한 생성자의 prototype(만약 생성자의 prototype값이 수정된다면 __proto__ 값도 이와 동일하게 수정됨.)
    */

    /* // [★프로토타입을 이용한 텍스트 RPG 게임]
    function logMessage(msg, color) { // 메시지를 #log에 추가
        if (!color) { color = 'black'; }
        var div = document.createElement('div');
        div.innerHTML = msg;
        div.style.color = color;
        document.getElementById('log').appendChild(div);  // log태그 안에 div를 넣음.
    }
    var gameover = false,
        battle = false;
    function Character(name, hp, att) {
        this.name = name;
        this.hp = hp;
        this.att = att;
    }
    Character.prototype.attacked = function(damage) {
        this.hp -= damage;
        logMessage(`${this.name}의 체력이 ${this.hp}가 되었습니다.`);
        if (this.hp <= 0) {
            battle = false;
        }
    };
    Character.prototype.attack = function(target) {
        logMessage(`${this.name}이 ${target.name}을 공격합니다.`);
        target.attacked(this.att);
    }
    function Hero(name, hp, att, lev, xp) {
        Character.apply(this, arguments);  // Hero를 Character에 상속
        this.lev = lev || 1;
        this.xp = xp || 0;
    }
    Hero.prototype = Object.create(Character.prototype);
    Hero.prototype.constructor = Hero;
    Hero.prototype.attacked = function(damage){
        this.hp -= damage;
        logMessage(`${this.name}님의 체력이 ${this.hp} 남았습니다.`);
        if (this.hp <= 0) {
            logMessage(`죽었습니다. 레벨 ${this.lev}에서 모험이 끝납니다. F5를 눌러 다시 시작하세요.`, 'red');
            battle = false;
            gameover = true;
        }
    }
    Hero.prototype.attack = function(target) {
        logMessage(`${this.name}님이 ${target.name}을 공격합니다.`);
        target.attacked(this.att);
        if (target.hp <= 0) {
            this.gainXp(target);
        }
    }
    Hero.prototype.gainXp = function(target) {
        logMessage(`전투에서 승리하여 ${target.xp}의 경험치를 얻습니다.`, 'blue');
        this.xp += target.xp;
        if (this.xp > 100 + 10*this.lev) {
            this.lev++;
            logMessage(`레벨업! ${this.lev} 레벨이 되었습니다. 남은 hp는 ${this.hp}입니다.`, 'blue');
            this.hp = 100 + this.lev*10;
            this.xp -= 10*this.lev + 100;
        }
    }
    function Monster(name, hp, att, lev, xp){
        Character.apply(this, arguments);10;
        this.lev = lev || 1;
        this.xp = xp || 10;
    }
    Monster.prototype = Object.create(Character.prototype);
    Monster.prototype.constructor = Monster;
    function makeMonster() {
        var monsterArray = [
            ['rabbit', 25, 3, 1, 35],
            ['skeleton', 50, 6, 2, 50],
            ['soldier', 80, 4, 3, 75],
            ['king', 120, 9, 4, 110],
            ['devil', 170, 25, 6, 250]
        ];
        var monster = monsterArray[Math.floor(Math.random()*5)];
        return new Monster(monster[0], monster[1], monster[2], monster[3], monster[4]);
    }
    var hero = new Hero(prompt('이름을 입력'), 100, 20);
    logMessage(`${hero.name}님이 모험을 시작합니다. 어느 정도까지 성장할 수 있을까요?`);
    while (!gameover) {
        var monster = makeMonster();
        logMessage(`${monster.name}을 마주쳤습니다. 전투가 시작됩니다. ${hero.hp}`, 'green');battle = true;
        while (battle) {
            hero.attack(monster);
            if (monster.hp > 0) {
                monster.attack(hero);
            }
        }
    }
    */

    /* // [hasOwnProperty(속성명)]
    // 해당 속성이 상속받지 않은 속성인지 알려줌.
    // 자신의 속성일 시 true, 부모의 속성이거나 아예 속성이 아니면 false.
    var obj = {
        example: 'yes',
    };
    console.log(
        obj.example, // 'yes'
        obj.hasOwnProperty('example'),  // true
        obj.toString,  // function toString() { [native code ] }
        obj.hasOwnProperty('toString')  // false
    )
    */

    /* // [객체.isPrototypeOf(대상)] : 객체가 대상의 조상인지 알려줌.
    // 모든 객체의 최종 prototype은 Object 객체
    var GrandParent = function() { console.log('GrandParent 실행!') };
    var Parent = function() { console.log('Parent 실행!') };
    // new로 생성하는 순간 해당 생성자가 실행됨.
    Parent.prototype = new GrandParent();  // 'GrandParent 실행!'
    Parent.prototype.constructer = Parent;
    var Child = function() { console.log('Child 실행!') };
    // Object.create(대상.prototype) : 객체를 만들되 생성자 실행은 X. 즉, 그냥 프로토타입만 넣는 것.
    // new 대상() : 생성자 실행.
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructer = Child;
    var child = new Child();  // Child() 실행.
    console.log(Parent.prototype.isPrototypeOf(child));  // true
    console.log(GrandParent.prototype.isPrototypeOf(child));  // true
    console.log(Object.getPrototypeOf(child) === child.__proto__);  // true; GrandParent
    console.log(Object.getPrototypeOf(new GrandParent()));  // GrandParent 실행됨, 빈 {} 반환. 만약 Parent()로 했으면 Parent() 실행되며 GrandParent{} 반환
    console.log(Object.setPrototypeOf(child, new Parent()));  // Parent() 실행됨, Child{}
    // 콘솔에다가 찍으면서 set해도 설정됨.
    
    // [객체 instanceof 생성자] : 객체가 특정 생성자의 자식인지 조회 가능.
    console.log(child instanceof Parent);  // true
    console.log(child instanceof GrandParent);  // true
    */

    /* // [propertyIsEnumerable(속성)] : 해당 속성이 열거 가능한 속성인지 알려줌. : for ... in 같은 반복문 안에서 쓸 수 있는지 확인. 상속받은 속성과 해당 객체의 속성이 아닌 것 제외.
    var a = [false, 1, '2'];
    console.log(a.propertyIsEnumerable(0));  // true
    console.log(a.propertyIsEnumerable('length'));  // false
    for (var prop in a) { // for ... in은 객체 내 속성의 인덱스만 반환 가능. value에 접근하는 방법은 없음. (물론 ${객체[인덱스or속성]}하면 되긴 함)
        console.log(prop);  // '0' '1' '2'
    }
    */

    /* // [객체.toString]
    var obj = { a: 'hi', b: 'jihye' };
    console.log(
        // 가끔 [object Object]가 출력되는 것은,
        // 내부적으로 toString 메소드가 호출된 것.
        // 문자열끼리 더할 때 주로 호출됨.
        // 기본적으로 객체 종류 알려주며, 사용자가 임의로 바꿀 수도 있음.
        obj.toString(),'\n',  // [object Object] : 객체 요소
        Math.toString(),'\n',  // [object Math] : Math 요소
        obj.toString = function() {  
            return this.a + ' ' + this.b;
        },'\n',  // 임의로 바꿈.
        obj.toString(),'\n',  // hi Jihye
        obj + ' Eun'  // hi Jihye Eun
    )
    */
    
    // [객체.valueOf]
    var obj = { a: 'hi', b: 'jihye' };
    console.log(
        // 객체의 기본 값 의미.
        // 숫자 계산 시 내부적으로 호출됨.
        obj.valueOf(),  // {a: "hi", b: "jihye", valueOf: ƒ} ; valueOf는 아래에서 함수 선언해줘서 나온다. 아니면 걍 빼고 obj 나옴
        obj + 5,  // '[object Object]5' : 숫자 계산 시 obj는 숫자가 아니라서 내부적으로 이렇게 출력된다.
        obj.valueOf = function() {  // 객체가 아니라 기본 자료형(boolean 등)일 땐 오류 남.
            return 3;
        },
        obj + 5,  // 8
    )
})();