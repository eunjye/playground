;(function(){
    'use strict';  // this === undefined (strict모드가 아닐 시 this === window)

    if ($.plugins === undefined){
        $.plugins = { _unique: 0 };
    }

    /** [$.extend와 $.fn.extend의 차이]
    $.extend: 함수; DOM에서 바로 접근 불가능. => this를 사용하여 DOM에 접근 불가. Object들의 merge용으로만 생각하자.
    $.fn.extend: jQuery의 프로토타입에 확장. 메소드; DOM에서 바로 접근 가능. jQuery.fn == jQuery.prototype
    */
    // true : obj2의 값을 obj1에 recursively하게 합침. key 값이 겹치는 부분의 값만 덮어쓰기.
    // ({}, obj1, obj2) : obj1의 값을 변경하지 않고 합침.
    $.fn.extend(true, $.plugins, {  
        /* 아코디언 */
        accordion: function(opt){
            var id = opt.id,
                speed = (opt.speed === undefined) ? 1000 : opt.speed,
                allClose = !!opt.allClose || (opt.allClose === undefined) ? true : false,
                $item = $('#' + id).find('.acco-list'),
                $title = $item.find('.acco-title'),
                inner = '.acco-inner',
                $cInner = null,  // 현재 누른 리스트의 inner
                itemH = 0,
                mgt = $item.find(inner).css('margin-top'),
                pdt = $item.find(inner).css('padding-top'),
                pdb = $item.find(inner).css('padding-bottom');

            $item.filter('.active').find(inner).show().css('height', 'auto');  // 초기화
            $title.attr('tabindex', '0');

            $title.off('click.accordion, keydown.accordion').on('click.accordion, keydown.accordion', function(e){
                if (e.keyCode === undefined || e.keyCode === 13 || e.keyCode === 32) {   // 클릭 or 스페이스 or 엔터
                    var $this = $(this).closest('.acco-list');
                    $cInner = $this.find(inner);

                    var hideItem = function(e){  // 아이템 닫기
                        e.css('display', 'block').stop().animate({
                            height: 0,
                            marginTop: 0
                        }, speed, function(){
                            e.hide();
                        })
                    }

                    if (!!$this.hasClass('active')){  // 열린 아이템 클릭 시
                        $this.removeClass('active');
                        hideItem($cInner);
                    } else {  // 닫힌 아이템 클릭 시
                        if (!!allClose) {  // 이외의 아이템 닫기 여부
                            hideItem($this.siblings('.active').find(inner));
                            $this.siblings('.active').removeClass('active');
                        }
                        $cInner.css('height', 'auto');
                        itemH = $cInner.outerHeight();
                        $cInner.css('height', '0');
                        $this.addClass('active');
                        $cInner.stop().animate({
                            height: itemH,
                            marginTop: mgt,
                            paddingTop: pdt,
                            paddingBottom: pdb
                        }, speed)
                    }
                }
            })
        },

        /* 아이템 정렬 */
        sortlist: function(opt){
            var list = {
                list: 0,
                $listWrap: null,
                $list: null,
                $item: null,
                $btnMove: null,
                isDouble: false,
                $mainList: null,
                $subList: null,
                isPressed: false,
                $itemPressed: null,
                $movable: null,

                settingList: function(opt){
                    list.$listWrap = $('#' + opt.id),
                    list.list = '.ej-sort-list',
                    list.$list = list.$listWrap.find(list.list),
                    list.$item = list.$listWrap.find('.sort-item'),
                    list.$btnMove = list.$list.find('.btn-sort'),
                    list.isDouble = (list.$list.length >= 2) ? true : false,
                    list.$movable = list.$item.not('.no-num');  // 리스트가 두 개 이상인지

                    /*
                    list.$btnMove.draggable({  // 버튼 드래그 기능
                        cancel: false,  // 버튼 요소 드래그 시는 cancel 속성 추가
                        axis: 'y'  // 세로로만 드래그
                    })
                    */

                    if (list.isDouble === true){  // 활성화, 비활성화 리스트 선언
                        list.$subList = list.$list.filter('.disabled');  // 비활성화 리스트
                        list.$mainList = list.$list.slice($.inArray(list.$subList, list.$list), 1);
                    }
                    list.settingItem();
                },

                moveItem: function(e){
                    var $item = e.closest(list.$item);
                    $item.addClass('moving');
                    e.on('drag.movingitem', function(cursor){
                        $item.offset({
                            'top': cursor.pageY - $item.outerHeight() / 2
                        })
                    })
                    $(document)
                        .off('mouseup.removemovingitem')
                        .on('mouseup.removemovingitem', function(){
                            list.$item.removeClass('moving');
                    })
                },

                leaveItem: function(e){
                    e.removeClass('moving');
                },

                settingItem: function(){
                    var itemNum = new Array;
                    $.each(list.$list, function(index, element){
                        $(element).find('.sort-num').remove();
                        $(element).find('.txt-label').remove();
                        if (element.tagName.toLowerCase() === 'ol'){
                            for (var i=0; i<=$(element).find(list.$item).length; i++){
                                itemNum[i] = document.createElement('span');
                                itemNum[i].className = 'sort-num';
                                itemNum[i].innerText = i+1;
                            }
                            for (var i=0; i<$(element).find(list.$item).length; i++){
                                $(element).find('.sort-item').eq(i).prepend(itemNum[i]);
                                if (i===0){
                                    $(element).find('.sort-item').eq(i).find('.sort-title').prepend('<span class="txt-label">주계좌</span>');
                                }
                            }
                        }

                    })
                },
                init: function(opt){
                    list.settingList(opt);
                    list.$list.sortable({
                        // placeholder: 'itemBoxHighlight',
                        constraint: 'vertical',
                        handle: list.$btnMove,
                        axis: 'y',
                        cancel: false,
                        items: list.$movable,
                        // pullPlaceholder: false,
                        connectWith: list.$list,
                        update: function(event, ui){
                            var item = ui.item;
                            var index = ui.item.index();
                            list.settingItem(item, index);
                        }
                    });
                    list.$btnMove  
                        .off('mouseup.leaveItem')
                        .on('mouseup.leaveItem', function(){
                            var e = $(this);
                        })
                        .on('mousedown.moveList2', function(){
                            var e = $(this);
                            list.moveItem(e);
                        })
                }
            }
            list.init(opt);
        },

        /* 슬라이드 */
        slide: (() => {


            function createSlide(opt){
                var id = (opt.id === undefined) ? console.error('id값이 없어요') : opt.id,
                    $wrap = $('#' + id),
                    $slide = $wrap.find('.ej-slide'),
                    $page = $slide.find('.ej-slide-page'),
                    $currPage = $page.filter('.active'),
                    $nextPage = null,
                    $prevPage = null,
                    $btn = null,
                    $btnToggle = null,
                    $btnNext = null,
                    $btnPrev = null,
                    $btnPaging = null,
                    currIndex = $currPage.index(),

                    speed = (opt.speed === undefined) ? 3000 : opt.speed,
                    aniSpeed = parseInt(speed/3),
                    
                    play = 1,  // 재생 상태
                    curr = 0;  // 현재 페이지 인덱스
                    
                drawSlideByOption(opt);
                resizeBox(0);  // 초기화
                setPage();

                var flowSlide = setInterval(function(){
                    nextSlide();
                }, speed);


                

                // 옵션에 따라 함수 실행
                function drawSlideByOption(opt){  // 컴포넌트 자동 생성
                    // 페이지 전환 버튼 생성 여부
                    if (opt.useBtnController === undefined || !!opt.useBtnController) {
                        $btnPaging = $wrap.find('.btn-paging');
                        // $btnPaging.
                    } else if(!opt.useBtnController) {
                        console.info(`${id}의 페이지 이동 컴포넌트가 없습니다.`);
                    };
                    // 재생/정지, 다음, 이전 버튼 생성 여부
                    if (opt.useBtnPlay === undefined || !!opt.useBtnPlay) {(
                        function(){
                            $btn = $wrap.find('.btn-slide');
                            $btnNext = $btn.filter('.next');
                            $btnPrev = $btn.filter('.prev');
                            $btnToggle = $btn.filter('.toggle');
                            $btnPrev
                                .off('click.toPrevSlide')
                                .on('click.toPrevSlide', function(){
                                    prevSlide();
                            });
            
                            $btnNext
                                .off('click.toNextSlide')
                                .on('click.toNextSlide', function(){
                                    nextSlide();
                                    clearInterval(flowSlide);
                                    switch (play){
                                        case 1: {
                                            flowSlide = setInterval(function(){
                                                nextSlide();
                                            }, speed);
                                            break;
                                        }
                                    }
                            });
                            
                            $btnToggle
                                .off('click.toggleSlide')
                                .on('click.toggleSlide', function(){
                                    switch (play){
                                        case 1: {  // 재생 중
                                            clearInterval(flowSlide);
                                            $btnToggle.text('슬라이드 재생');
                                            play = 0;
                                            break;
                                        };
                                        case 0: {  // 정지 상태
                                            flowSlide = setInterval(function(){
                                                nextSlide();
                                            }, speed);
                                            $btnToggle.text('슬라이드 정지');
                                            play = 1;
                                            break;
                                        }
                                    }
                            });
                        }
                    )()} else if (!opt.useBtnPlay){
                        console.info(`${id}의 슬라이드 제어 버튼이 없습니다.`)
                    }
                };

                function setPage() {  // 페이지 갱신
                    $currPage = $page.eq(currIndex);
                    if (currIndex < $page.length-1 && 0 < currIndex){
                        $nextPage = $page.eq(currIndex+1);
                        $prevPage = $page.eq(currIndex-1);
                    } else if (currIndex === 0){
                        $nextPage = $page.eq(currIndex+1);
                        $prevPage = $page.eq($page.length-1);
                    } else if (currIndex === $page.length-1){
                        $nextPage = $page.eq(0);
                        $prevPage = $page.eq(currIndex-1);
                    }
                }
                function resizeBox(flag){  // 슬라이드 영역 크기 재조정
                    var currW = $currPage.outerWidth(),
                        currH = $currPage.outerHeight();
                    if (flag === 0){
                        $slide.outerWidth(currW).outerHeight(currH);
                    } else {
                        $slide.stop().animate({
                            width: currW,
                            height: currH
                        }, aniSpeed);
                    }
                };
                function nextSlide(){  // 다음 슬라이드로 넘김
                    var w = $currPage.outerWidth();
                    $page.not($currPage).hide();
                    $nextPage.show().css('left', w);
                    $slide.find('ul').stop().animate({
                        left: -w
                    }, aniSpeed, function(){
                        $prevPage.removeClass('active');
                        $currPage.show().addClass('active').css('left', 0);
                        $slide.find('ul').css('left', 0);
                    });
                    if (currIndex === $page.length-1){
                        currIndex = 0;
                    } else {
                        currIndex++;
                    }
                    setPage();
                    resizeBox();

                };
                function prevSlide(){  // 이전 슬라이드로 넘김
    
                    resizeBox();
                };
                // function flowSlide(){  // 슬라이드 자동 재생
    
                // };
                function stopSlide(){  // 슬라이드 멈춤
    
                };
                function jumpSlide(){  // 페이징 컴포넌트 클릭 시 슬라이드 넘김
    
                };

            }
            return (opt) => {createSlide(opt)}
        })()
    })



})();