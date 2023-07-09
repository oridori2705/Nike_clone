
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
    let endterNewScene=false;//새로운 섹션이 시작된 순간 true =>섹션이 바뀔때 잠깐 스크롤값이 마이너스값이 나온다 이를 방지


    //4개의 섹션
    //높이는 브라우저마다 창사이즈 변경의 가능성이 있으므로 고정값이 아닌 몇 배수로 설정해야함
    const sceneInfo=[
        {
            //0
            type: "sticky",
            heightNum: 5,
            scrollHeight:0,
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
                messageA_opacity_in : [0,1,{start : 0.1, end:0.2}], //투명도 0에서 1로 (나타날 때)
                //start,end는 특정 타이밍에 스크롤 애니메이션 나타나게하기 - 10퍼센트부분에서 20퍼센트구간에 등장한다.
                messageA_translateY_in : [20,0,{start : 0.1,end:0.2}], //20퍼센트정도 Y를 내렸다가 0으로 올리는것
                //나타났다가 사라지는 out도 만들어줘야함
                messageA_opacity_out : [1,0,{start : 0.25, end:0.3}],
                messageA_translateY_out : [0,-20,{start : 0.25,end:0.3}], //0에서 -20으로 Y를 올리는것

                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],

                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],

                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {
            //1
            type: "normal",
            //heightNum: 5,
            scrollHeight:0,
            objs :{
                container : document.querySelector("#scroll-section-1"),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
        {
            //1
            type: "sticky",
            heightNum: 5,
            scrollHeight:0,
            objs :{
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                messageD: document.querySelector('#scroll-section-2 .d'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                pinD: document.querySelector('#scroll-section-2 .d .pin'),
            },
            values: {
                // 0.05 ~ 0.1  0.13 ~ 0.2
                messageA_translateY_in: [20, 0, { start: 0.05, end: 0.1 }],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
                messageA_translateY_out: [0, -20, { start: 0.15, end: 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.15, end: 0.2 }],

                //0.25 ~ 0.3   0.35 ~ 0.4
                messageB_translateY_in: [30, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.35, end: 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.35, end: 0.3 }],

                pinB_scaleY: [0.5, 1, { start: 0.25, end: 0.3 }],
                pinB_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                pinB_opacity_out: [1, 0, { start: 0.35, end: 0.4 }],
                
                //0.45 ~ 0.5   0.45 ~ 0.5
                messageC_translateY_in: [30, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.55, end: 0.6 }],
                messageC_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],

                pinC_scaleY: [0.5, 1, { start: 0.45, end: 0.5 }],
                pinC_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
                pinC_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],

                // 0.75 ~ 0.8    0.85 ~ 0.9
                messageD_opacity_in: [0, 1, { start: 0.75, end: 0.8 }],
                messageD_translateY_in: [20, 0, { start: 0.75, end: 0.8 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],

                pinD_scaleY: [0.5, 1, { start: 0.75, end: 0.8 }],
                pinD_opacity_in: [0, 1, { start: 0.75, end: 0.8 }],
                pinD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]

            }
        },
        {
            //2
            type: "sticky",
            heightNum: 5,
            scrollHeight:0,
            objs :{
                container : document.querySelector("#scroll-section-3"),
                canvasCaption: document.querySelector('.canvas-caption')
            }
        }
    ]
    
    
    
    
    //-------새로고침되거나 브라우저 창크기가 바뀔때 섹션마다의 높이를 비율에 맞게 설정함-----
    function setLayout(){
        //4구간의 scrollHeight를 설정해줌
        for(let i=0;i<sceneInfo.length;i++){
            if(sceneInfo[i].type=="sticky"){
                // window.innerHeight : 뷰포트의 높이
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                
            }else if(sceneInfo[i].type=="normal") {
                //offsetHeight는 html 객체가 원래 가지고 있는 속성으로, 높이값입니다. 즉 우리는 container 객체(.scroll-section)의 높이값을 가져오는 것입니다.
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;//그냥 기존 높이로 설정하면 딱 그 콘텐츠에 맞게 높이가 설정된다.
            }
            //뷰포트만큼 heigth설정
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }
        yOffset=window.scrollY;
        let totalscrollHeight=0;
        //모든 섹션의 높이를 더해가면서 현재 스크롤 값보다 커지거나  같아지면 for문을 멈춰주고 현재 i를 current값으로 설정한다.
        //이는 스크롤 중간에 새로고침했을 때 current값이 초기화 되는 것을 방지하기위해 설정 
        for(let i=0; i<sceneInfo.length; i++){
            totalscrollHeight+=sceneInfo[i].scrollHeight;
            if(totalscrollHeight>=yOffset){
                currentScene=i;
                break;
            } 
        }
        //처음에 렌더링될때 body에 id를 설정해줘야 된다. 후에 currentScene이 바뀔 때 설정되는 setAttrubute가 잘 설정된다.
        document.body.setAttribute('id',`show-scene-${currentScene}`);
    }




    //------n번 섹션에서 얼마나 스크롤이 되었는지의 섹션에서의 스크롤 비율을 구해야함(각각의 섹션마다의 스크롤 비율 0~1까지 )--------------
    function calcValues(values,currentYOffset){
        let rv;//비율구하는 변수

        //현재 섹션에서 스크롤된 값을 비율로 구함(0~1의 값으로 구함)
        const scrollHeight=sceneInfo[currentScene].scrollHeight; //한 섹션의 높이
        const scrollRatio = currentYOffset/scrollHeight;
        
        //특정타이밍에 스크롤할 애니메이션 값 객체가 있는 경우
        if(values.length==3){
            //start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            
            //현재 애니메이션의 비율의 길이
            const partScrollHeight=partScrollEnd - partScrollStart;

            //애니메이션의 start와 end보다 스크롤 값이 작거나 클 때의 경우를 생각해야한다.
            //즉 애니메이션 시작 전에는 안보여야하고, 애니메이션이 끝나면 opacity를 계속 보여야한다.
            if(currentYOffset>=partScrollStart && currentYOffset<=partScrollEnd){
                //부분 스크롤영역에 비율이 반영되어야하므로 (현재 이동한 스크롤값-애니메이션이 시작될 값) / 애니메이션의 길이 => 를 해줘야 정해진 순서에 애니메이션이 시작됐을때 opacity가 시작되고 끝난다.
                rv=(currentYOffset-partScrollStart)/partScrollHeight *(values[1]-values[0])+values[0]
            }
            else if(currentYOffset<partScrollStart){
                rv=values[0];
            }
            else if(currentYOffset>partScrollEnd){
                rv=values[1];
            }

        }else{
            //values[1]-values[0]->전체범위를 뜻함 : 끝값에서 시작값을 빼면 그 범위가 나옴 쉽게말해서 0~1의 범위는 1이다.
            // + values[0] : 시작 값을 넣어줘야 만약 200부터 시작하면 200부터 ~ 700 이런식으로 됨 (0~700이 아닌)
            rv=scrollRatio*(values[1]-values[0])+values[0];//opacity를 구하는 것임
        }
        return rv;
    }




    //--------------현재 실행되고있는 섹션의 애니메이션을 구분해서 부하가 안걸리게함---------------
    function playAnimation(){
        const objs= sceneInfo[currentScene].objs;
        const values=sceneInfo[currentScene].values;
        const currentYOffset=yOffset-prevScrollHeight;//현재 보이는 섹션의 스크롤의 값을 0 ~ 섹션높이 로 설정
        
        const scrollHeigth = sceneInfo[currentScene].scrollHeight; //현재 섹션의 높이
        const scrollRatio = currentYOffset / scrollHeigth; //현재 섹션에서의 스크롤 비율 값
        
        switch(currentScene){
            case 0:
                //여기서 스크롤 애니메이션이 나타나는 애니메이션 없어지는 애니메이션이 실행됨
                //그때 현재 섹션에서의 스크롤 비율에 따라 0.22를 기준으로 해서 시작애니메이션 종료애니메이션을 구분함
                if(scrollRatio <=0.22) {
                    //애니메이션 in
                    objs.messageA.style.opacity=calcValues(values.messageA_opacity_in,currentYOffset);
                    objs.messageA.style.transform=`translateY(${calcValues(values.messageA_translateY_in,currentYOffset)}%)`;

                }else{
                    //애니메이션 out
                    objs.messageA.style.opacity=calcValues(values.messageA_opacity_out,currentYOffset);
                    objs.messageA.style.transform=`translateY(${calcValues(values.messageA_translateY_out,currentYOffset)}%)`;
                }
                 //메세지B
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
                //메세지C
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                //메세지D
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                break;



            case 2:
                if (scrollRatio <= 0.17) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.69) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.87) {
                    // in
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.pinD.style.transform = `scaleY(${calcValues(values.pinD_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.pinD.style.transform = `scaleY(${calcValues(values.pinD_scaleY, currentYOffset)})`;
                }
    
                break;
            case 3:
                break;  
        }

    }


    //-------------스크롤 될 때마다 수행하는 함수----------------
    function scrollLoop(){
        endterNewScene =false;
        prevScrollHeight = 0;
        //currentScene을 사용한 이유는 내가 보고있는 섹션의 다음 시작선을 구분하기위해
        for(var i=0;i<currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        //여기서 중요하다
        /*
        위 i를 currentScene까지 반복한 이유는
        내가 만약 0번을 지나 1번을 보고있다면 prevScrollHeight는 두 섹션의 높이의 합을 가진다.
        그래서 yOffset이 prev값을 완전히 넘어가면 2번 섹션을 보고잇다는 뜻이 된다.

        추가적으로 맨위 네비게이션바로 인해 약간의 스크롤값에 오차가 생긴다 메뉴를 absoulte로바꾼다.
         */
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            endterNewScene=true; //이전섹션의 높이 + 현재보고있는 섹션의 높이보다 커지면 current 증가
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        //만약 스크롤이 올라간다면
        //prev보다 작아질 때가 온다 그때는 섹션을 빼줘야한다.
        //즉 currentscene현재 보고있는 섹션에서 2번섹션이 보이기 시작할때 currentscene은 2번섹션으로 간다.
        if(yOffset<prevScrollHeight) {
            endterNewScene=true; 
            //혹시모르는 scrollY값에 마이너스값이 나오는걸 방지
            if(currentScene===0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        
        //섹션이바뀌는 찰나의순간에는 함수를 멈춰줘서 마이너스값이 playAnimation에 못들어가게한다.
        if(endterNewScene) return;
        playAnimation();

    }
    //창이 줄어들때마다 함수실행
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
          window.location.reload();
      }
    });
    //스크롤중간에 새로고침했을때 각 섹션의 높이 값과 currentScene값을 설정해줘야한다.
    //또한 모든 이미지로드히고나서 해야하기 때문에 load를 사용
    window.addEventListener("load",setLayout());
    window.addEventListener("scroll",()=>{
        yOffset=window.scrollY;
        scrollLoop();
    });
    setLayout();
})();