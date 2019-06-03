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
    
    /* // [객체.valueOf]
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
    */
   
    /* // [Object.create(prototype, 속성들)]
    // 객체를 생성하는 방법 중 하나. 여러 속성들이 존재.
    // 속성들과 맞지 않을 시 strict모드에서는 error가 뜨고, 일반모드에서는 그냥 적용되지 않은 상태로 넘어간다. (ex: writabel: false일 시 값을 재설정하면, strict모드에서는 error 이후 넘어가지 않지만, 일반모드에서는 그냥 값이 바뀌지 않고 이전값으로 적용되어 넘어간다.)
    var obj = Object.create(Object.prototype);  // var obj = {}; 와 같음.
    var obj2 = Object.create(null, {
        a: {
            writabel: true,
            configurable: false,
            value: 5,
        }
    });
    console.log(obj2.a); 

    // [Object.defineProperties(객체, 속성들), Object.defineProperty(객체, 속성, 설명)]
    // 객체의 속성을 자세하게 정의 가능.
    Object.defineProperties(obj, {
        // writabel, enumerable, configuable은 defineProperties로 정의할 시 기본값 false, 
        // 그냥 객체 = {} 식으로 정의하면 기본값 true
        a: {
            value: 10,  // 속성값
            writable: true,  // 속성값을 변경 가능한가
            enumerable: true,  // for ... in 반복문에서 사용 가능한가
        },
        b: {
            // value와 writable은 get, set과 함께 선언 불가하네
            // value: 'hi',
            // writable: true,
            get: function() {  // 속성의 값을 가져올 때 (value정의와 함께 정의 불가)
                return 'jihye';
            },
            set: function(value) {  // 속성의 값을 설정할 때 (value정의와 함께 정의 불가)
                console.log(this, value);
                this.a = value;
            },
            enumerable: false,
            configurable: true,  // 속성의 설명을 변경 가능한가. false인 경우 delete 동작도 불가.
        }
    });
    console.log(obj.a, obj.b)  // 10 'jihye'
    // obj.a = 20;  // writable이 false 시 error
    console.log(obj.a);  // 10
    for (var key in obj) {
        console.log(key);  // 'a' ; 'b'의 enumarable이 false이므로
    }
    obj.b = 'eun';  // set 내의 함수 실행. ==> {a: 20} 'eun'
    // 위에서 obj.b의 value는 'jihye'였으나(get()으로 인해),
    // set과 동시에 obj(this)와 'eun'(여기서 들어왔던 value)이 출력됨 (obj.a의 writable이 false면 error)
    // obj.b의 writable: true|false가 있으면 오류가 나며 값이 변하지 않음 (왜징)
    console.log(obj.a, obj.b);  // 'eun jihye' ; 
    // [defineProperty] : 객체의 한 속성의 설명만 수정
    Object.defineProperty(obj, 'b', {
        value: 'bye',
        configurable: false
    });
    console.log(obj.b);  // 재정의돼서 set get 사라짐.
    // delete(obj.b);  // error; configurable: false로 인하여 삭제 불가
    Object.defineProperty(obj, 'c', {
        value: { x: 3, y: 4 },
        writable: false,
        enumerable: true,
    });
    console.log(obj.c);
    // obj.c = 'silver';  // writable: false 때문에 error
    obj.c.x = 5;
    console.log(obj.c);  // {x: 5, y: 4} ; writable은 속성의 값이 객체인 경우, 그 객체 내 속성을 바꾸는 것은 막지 못함.
    // 전체적으로 막기 위해 Object.freeze 메소드가 있다.

    // [Object.freeze()] : 속성 내부의 모든 객체의 속성 값이 변하는 것을 막음.
    Object.freeze(obj.c);
    obj.c.x = 20;  // error
    // [Object.seal()] : 속성의 추가/제거 막고, configurable을 false로 바꿈.
    // 대신 속성의 값은 writable: true이기만 하면 변경 가능.
    // [Object.preventExtensions] : 속성의 추가만 막음. 그 외에 속성 제거, 값 변경, 설정 변경은 가능.
    // ** 위의 세 상태를 알기 위해 Object.isFrozen, Object.isSealed, Object.isExtensible을 사용한다.
    */

    /* // [Object.keys(객체)] : 객체의 속성명을 모두 가져와 배열 생성. enumerable: false인 것은 예외.
    var obj3 = {a: 'aa', b: 'bb', c: 'cc', d: 'dd'};
    Object.defineProperty(obj3, 'c', {
        enumerable: false
    });
    console.log(Object.keys(obj3));  // ['a', 'b', 'd']
    */

    /* // [typeof] : 식의 타입 반환. 객체 뿐만 아니라 배열, null도 object로 표시되므로,
    // 배열 구분을 위해 Array.isArray 메소드 사용,
    // null을 구분하려면 따로 처리해야 함. (null이 object로 표시되는 건 js의 실수로 여겨짐.)
    var a = 1,
        b = 'jihye',
        c = true,
        d = {a: 'hi', b: 'jihye'},
        e = [],
        f = function() {},
        g,
        h = null;
    console.log(
        typeof(a),  // number
        typeof(b),  // string
        typeof(c),  // boolean
        typeof(d),  // object
        typeof(e),  // object
        Array.isArray(e),  // true
        typeof(f),  // function
        typeof(g),  // undefined
        typeof(h)  // object
    )
    console.log(d);  // {a: "hi", b: "jihye"}
    // delete(d);  // strict 모드에서는 error
    delete(d.a);
    console.log(d);  // {b: "jihye"}
    */

    /* // [네임스페이스 방식] : 변수 중복 방지를 위한 선언 방식
    // [기본 방식] : obj라는 변수를 통해 고유 변수명을 짓는 것이기 때문에 중복될 염려가 없다.
    var obj = {
        x: 'local',
        y: function() {
            console.log(this.x);
        }
    };
    obj.y();  // 'local'

    // [기본 방식의 단점] : 코드 밑에 단순히 스크립트를 조금만 추가해도 달라질 수 있다.
    obj.x = 'hacked';
    obj.y();  // hacked'

    // [네임스페이스 기본 방식의 단점을 보완하기 위한 방법 : 비공개 변수]
    // (function() {})(); : IIFE(즉시 호출 함수 표현식) / 모듈 패턴
    var newScope = (function() {
        var x = '로컬에서만 조작할 수 있어요!'
        return {  // 외부에서 y만 접근 가능. (another = {y: y})
            y: function() {
                console.log(x);
            }
        }
    })();
    newScope.y();
    console.log(newScope.x);  // 외부에서는 x를 부를 수 없다.
    newScope.x = '외부에서는 y()가 부르는 x를 조작할 수 없습니다.';  // return되지 않으므로 외부에서 조작 불가
    newScope.y();
    console.log(newScope.x);  // 네임스페이스 내의 y함수가 호출하는 x값은 네임스페이스 내 선언됐던 x 값이 호출된다.
    */

    /* // ★★[호이스팅] : 변수를 선언하고 초기화했을 때 선언 부분이 최상단으로 끌어올려지는 현상.
    // 함수 표현식이 아니라 함수 선언식일 때는, 함수 호출이 선언보다 먼저 있어도 선언식 자체가 통째로 끌어올려지며 에러 발생 X
    console.log(obj2);  // error가 아니라 undefined. 선언이 맨 처음에 되고 대입은 후에 되니까. 만약 밑에서 obj2를 정의하지 않았으면 error.
    obj1();
    function obj1() {
    // var obj1 = function() {...}하면 위로 끌어올려지지 않음. 선언은 맨 처음에 되지만 대입은 이 차례에서 되기 때문.
        console.log('실행된다.');
    };
    var obj2 = '실행되지 않는다.'
    // ==> ★ 대입은 순서대로, 선언은 맨 위에서. 함수 선언식은 선언과 동시에 대입!
    */

    /* // ★★[클로저(closure)] : 비공개 변수를 가질 수 있는 환경에 있는 함수
    // 비공개 변수 : 클로저 함수 내부에서 생성한 변수도, 매개변수도 아닌 변수.
    // 컨텍스트 : 문맥, 코드의 실행 환경.
    // 전역 컨텍스트, 함수 컨텍스트 생성 후 생명주기동안 유지됨.
    // 함수 컨텍스트는 함수 호출 시마다 생성됨.
    // 컨텍스트 생성 시 컨텍스트 안에 변수객체(arguments, variable), scope chain, this가 생성됨.
    // 컨텍스트 생성 후 함수가 실행되는데, 변수들은 변수 객체 안에서 값을 찾고, 없다면 스코프 체인을 따라 올라가며 찾음.
    // 함수 실행이 마무리되면 해당 컨텍스트는 사라짐. (클로저 제외)
    // 페이지 종료 시 전역 컨텍스트 사라짐.

    // 비공개 변수를 포함하고 있는 함수 : 비공개 변수나, 비공개 변수가 있는 스코프에 대한 클로저.
    // 비공개 변수 : 스코프 내부에서 생성되지도 않았고, 해당 스코프의 매개변수도 아닌 변수.

    // 고정된 j에 대한 클로저인 function 만듦.
    // 만약 여기서 고정된 j에 대한 클로저인 function을 만들지 않으면, 함수는 선언할 때 스코프가 생성되는 특성을 가지므로, 이벤트리스너 안의 i는 외부의 i를 계속 참조한다. 따라서 i는 반복문 종료 후 최종적으로 5가 되므로 모두 alert(5)를 하게 된다. (이해 모호)
    // 클로저를 이용하지 않으면
    for (var i=0; i<5; i++){
        $('#target' + i).on('click', function() {
            alert(i);  // 5
        })
    }
    // 클로저를 이용
    for (var i=0; i<5; i++){
        (function(j) {
            $('#target' + j).on('click', function() {
                alert(j);  // j
            })
        })(i);
    }
    */

    /* // [JSON]
    var example = {
        'stringifyMe': 'please',
        'andParseMe': 'thankYou'
    };
    var string = JSON.stringify(example);  // JSON을 문자열로 만들기
    var parsed = JSON.parse(string);  // 원상태로
    
    var obj = {test: 'yes'};
    var obj2 = JSON.parse(JSON.stringify(obj));  // {test: 'yes'} ; 참조X 복사O
    obj2.text = 'no';
    console.log(obj.test, obj2.test);  // 'yes yes'
    */

    /* // [CallBack]
    // setTimeout을 사용함으로써, 해당 계산이 끝날 때까지 기다린 이후 다음 동작들이 실행되는게 아니고, 일단 다음 동작들이 실행되다가 계산이 끝나면 '비동기적'으로 결과를 출력함.
    var cbExample = function(number, cb){
        setTimeout(function(){  // setTimeout을 사용함으로써 비동기적으로 실행됨. 0초만에 실행하도록 했지만 비동기적으로 실행됨. 이 부분을 빠트리면 55가 first보다 먼저 표시됨. CallBack의 의미가 없어짐.
            var sum = 0;
            for (var i=number; i>0; i--){
                sum += i;
            }
            cb(sum);
        }, 0);
    };
    cbExample(10, function(result){
        console.log(result);  // 55
    });
    console.log('first');
    */

    /* // [이벤트 객체]
    // getElementsByClassName()으로 가져온 값은 배열이 아니라 HTMLCollection.
    var btns = document.getElementsByClassName('aaa');
    Array.prototype.forEach.call(btns, function(btn){  // 배열의 프로토타입에 있는 forEach 메소드를 가져와서 btns에 적용.
        console.log(btn);
        btns[0]
        .addEventListener('click', function(event){
            event.stopImmediatePropagation();
            console.log(event);
            event.preventDefault();  // 태그의 기본 동작을 막음
            // event.stopPropagation();  // 태그 이벤트 시 부모에게 이벤트가 전달(버블링)되지 않도록 막음.
            // event.stopImmediatePropagation();  // 버블링을 막음과 동시에, 같은 이벤트의 다른 리스너도 실행되지 않도록 막음.
        });
    });
    */

    /* // prototype 상속하는 응용 방법
    var Person = (function(){
        function makePerson(name, age){
            this.name = name;
            this.age = age;
        };
        $.extend(makePerson.prototype, {
            sayHello: function(){
                console.log(this.name, this.age);
            }
        });
        return makePerson;
    })();

    var Child = (function(){
        function makeChild(name, age, school){
            // apply: Person과 중복되는 인자 공유하기. 매개변수로는 this와 인자들을 하나로 묶어 배열로 만들어 넣음.
            // arguments: 인자들의 묶음. 엄연히 말하자면 유사배열.
            Person.apply(this, arguments);
            this.school = school;
        };
        // Child와 Person의 prototype 연결
        makeChild.prototype = Object.create(Person.prototype);
        makeChild.prototype.constructor = makeChild;
        // Person과 공유되지 않는 Child만의 메소드 생성
        $.extend(makeChild.prototype, {
            introduceSchool: function(){
                console.log(this.school);
            }
        })
        return makeChild;
    })();

    var jihye = new Person('jihye', 131);
    var child = new Child('jidol', 10, 'Bucheon Elementary School');
    jihye.sayHello();  // 'jihye' 131
    child.introduceSchool();  // 'Bucheon Elementary School'
    child.sayHello();  // 'jidol' 10
    */

    // [call] : this, 인자를 바꿔넣어서 다른 함수를 사용 가능.
    var obj = {
        name: 'jihye',
        say: function(){
            console.log(this.name);
        }
    };
    var obj2 = {
        name: 'jidol'
    };
    obj.say();  // 'jihye'
    obj.say.call(obj2);  // 'jidol'
    function Func1() {
        this.aa = '안녕하세요';
        this.bb = '안바뀜';
        return (this.aa, this.bb);
    }
    function Func2() {
        Func1.call(this);
        this.bb = '바뀜';
    }
    console.log(new Func1());  // Func1 {aa: "안녕하세요", bb: "안바뀜"}
    console.log(new Func2());  // Func2 {aa: "안녕하세요", bb: "바뀜"}

    // 참고 강의 : ZeroCho 블로그 [https://www.zerocho.com/]
})();