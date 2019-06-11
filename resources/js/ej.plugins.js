;(function(){
    'use strict';  // this === undefined (strict모드가 아닐 시 this === window)

    if ($.plugins === undefined){
        $.plugins = { _unique: 0 };
    }

    $.extend(true, $.plugins, {

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
        }
    })

    $.plugins.accordion({
        id: 'accordion1',
        speed: 200,
        allClose: true // 활성화 시 다른 탭 닫음
    });

    $.plugins.accordion({
        id: 'accordion2',
        speed: 200,
        allClose: false // 활성화 시 다른 탭 닫음
    });

    $.plugins.sortlist({
        id: 'sortingList1'
    });
})();