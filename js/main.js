
//스크롤을 아용한 인터렉션 구현
/*
1. 4개의 섹션을 나눔
2. 4개의 섹션에서 sticky한 요소를 구분시키고 display : none함
2. 4개의 섹션에 heigth를 뷰포트의 크기에 비례해서 *5해서 지정함

*/


(()=>{
    let yOffset=0;//window.scrollY의 값
    let prevScrollHeight=0; //현재 스크롤위치보다 이전에 위치한 섹션들의 스크롤 높이 함
    let currentScene=0; //현재 활성화된 scene(현재 보고있는 섹션)
    //4개의 섹션
    //높이는 브라우저마다 창사이즈 변경의 가능성이 있으므로 고정값이 아닌 몇 배수로 설정해야함
    const sceneInfo=[
        {
            //0
            type: "sticky",
            heightNum: 5,
            scrollHeigth:0,
            objs :{
                container : document.querySelector("#scroll-section-0"),
                //각각의 sticky메시지를 가져옴 앞에 id를 붙여줌으로써 클래스 중복문제 해결
                messageA : document.querySelector("#scroll-section-0 .main-message.a"),
                messageB : document.querySelector("#scroll-section-0 .main-message.b"),
                messageC : document.querySelector("#scroll-section-0 .main-message.c"),
                messageD : document.querySelector("#scroll-section-0 .main-message.d"),

            },
            //어느시점에 등장시킥고 빠져나갈지 지정하기위한 값
            values :{
                messageA_opacity : [0,1] //투명도 0에서 1로 (나타날 때)

            }
        },
        {
            //1
            type: "normal",
            heightNum: 5,
            scrollHeigth:0,
            objs :{
                container : document.querySelector("#scroll-section-1")
            }
        },
        {
            //1
            type: "sticky",
            heightNum: 5,
            scrollHeigth:0,
            objs :{
                container : document.querySelector("#scroll-section-2")
            }
        },
        {
            //2
            type: "sticky",
            heightNum: 5,
            scrollHeigth:0,
            objs :{
                container : document.querySelector("#scroll-section-3")
            }
        }
    ]

    function setLayout(){
        //4구간의 scrollHeigth를 설정해줌
        for(let i=0;i<sceneInfo.length;i++){
            // window.innerHeight : 뷰포트의 높이
            sceneInfo[i].scrollHeigth = sceneInfo[i].heightNum * window.innerHeight;
            //뷰포트만큼 heigth설정
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeigth}px`
        }
        yOffset=window.scrollY;
        let totalScrollHeigth=0;
        //모든 섹션의 높이를 더해가면서 현재 스크롤 값보다 커지거나  같아지면 for문을 멈춰주고 현재 i를 current값으로 설정한다.
        //이는 스크롤 중간에 새로고침했을 때 current값이 초기화 되는 것을 방지하기위해 설정 
        for(let i=0; i<sceneInfo.length; i++){
            totalScrollHeigth+=sceneInfo[i].scrollHeigth;
            if(totalScrollHeigth>=yOffset){
                currentScene=i;
                break;
            } 
        }
        //처음에 렌더링될때 body에 id를 설정해줘야 된다. 후에 currentScene이 바뀔 때 설정되는 setAttrubute가 잘 설정된다.
        document.body.setAttribute('id',`show-scene-${currentScene}`);
    }
    //1번 섹션에서 얼마나 스크롤이 되었는지의 비율을 구해야함(각각의 섹션마다의 스크롤 비율 0~1까지 )
    function calcValues(values,currentYOffset){
        let rv;//비율구하는 변수
        //현재 섹션에서 스크롤된 값을 비율로 구함(0~1의 값으로 구함)
        let scrollRatio = currentYOffset/sceneInfo[currentScene].scrollHeigth;
        //values[1]-values[0]->전체범위를 뜻함 : 끝값에서 시작값을 빼면 그 범위가 나옴 쉽게말해서 0~1의 범위는 1이다.
        // + values[0] : 시작 값을 넣어줘야 만약 200부터 시작하면 200부터 ~ 700 이런식으로 됨 (0~700이 아닌)
        rv=scrollRatio*(values[1]-values[0])+values[0];//opacity를 구하는 것임
        return rv;
    }

    //현재 실행되고있는 섹션의 애니메이션을 위해
    function playAnimation(){
        const objs= sceneInfo[currentScene].objs;
        const values=sceneInfo[currentScene].values;
        const currentYOffset=yOffset-prevScrollHeight;//현재 보이는 섹션의 스크롤의 값을 0 ~ 섹션높이 로 설정
        switch(currentScene){
            case 0:
                let messageA_opacity_in =calcValues(values.messageA_opacity,currentYOffset)
                objs.messageA.style.opacity=messageA_opacity_in;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;  
        }

    }
    function scrollLoop(){
        prevScrollHeight = 0;
        //currentScene을 사용한 이유는 내가 보고있는 섹션의 다음 시작선을 구분하기위해
        for(var i=0;i<currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeigth;
        }
        //여기서 중요하다
        /*
        위 i를 currentScene까지 반복한 이유는
        내가 만약 0번을 지나 1번을 보고있다면 prevScrollHeight는 두 섹션의 높이의 합을 가진다.
        그래서 yOffset이 prev값을 완전히 넘어가면 2번 섹션을 보고잇다는 뜻이 된다.

        추가적으로 맨위 네비게이션바로 인해 약간의 스크롤값에 오차가 생긴다 메뉴를 absoulte로바꾼다.
         */
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeigth) { //이전섹션의 높이 + 현재보고있는 섹션의 높이보다 커지면 current 증가
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        //만약 스크롤이 올라간다면
        //prev보다 작아질 때가 온다 그때는 섹션을 빼줘야한다.
        //즉 currentscene현재 보고있는 섹션에서 2번섹션이 보이기 시작할때 currentscene은 2번섹션으로 간다.
        if(yOffset<prevScrollHeight) {
            //혹시모르는 scrollY값에 마이너스값이 나오는걸 방지
            if(currentScene===0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
            console.log(currentScene);
        }
        


        playAnimation();

    }
    //창이 줄어들때마다 함수실행
    window.addEventListener("resize",setLayout);
    //스크롤중간에 새로고침했을때 각 섹션의 높이 값과 currentScene값을 설정해줘야한다.
    //또한 모든 이미지로드히고나서 해야하기 때문에 load를 사용
    window.addEventListener("load",setLayout);
    window.addEventListener("scroll",()=>{
        yOffset=window.scrollY;
        scrollLoop();
    });
    setLayout();
})();