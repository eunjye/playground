var accordion = (function(){
    'use strict'; 

    function createAccordion(opt){
        var $wrap = $('.ui-acco'),
            $item = $wrap.children('.ui-acco-wrap'),
            $tit = $item.children('.ui-acco-tit'),
            $pnl = $item.children('.ui-acco-pnl'),
            $btn = $tit.children('.ui-acco-btn');

        function toggleItem(){
            var $ts = $(this),
                $tsItem = $ts.closest($item),
                $tsPnl = $tsItem.children('.ui-acco-pnl');
            
            // 선택돼있지 않다면
            if (!$ts.hasClass('selected')){
                $tsPnl.stop().slideDown(300);
                $ts.addClass('selected');
            } else {
                $tsPnl.stop().slideUp(300);
                $ts.removeClass('selected');
            }
            console.log($ts.hasClass('selected'));
        };

        function evtKeydown(e){
            var $ts = $(this),
                $tsWrap = $ts.closest($wrap),
                $sivItem = $tsWrap.children($item),
                $tsItem = $ts.closest($item),
                $tsPnl = $tsItem.children('.ui-acco-pnl'),
                i = $sivItem.index($tsItem),
                num = $sivItem.length,
                $target = null;
            
            switch (e.keyCode){
                // enter
                case 13: toggleItem(e);
				break;
                
                // space
                case 32: toggleItem(e);
				break;

                // end 키
				case 35: moveEndItem(e);
				break;

                // home 키
				case 36: moveHomeItem(e);
				break;

                // 왼 방향키
				case 37: movePrevItem(e);
				break;
                // 위 방향키

				case 38: movePrevItem(e);
                break;
                
                // 오른 방향키
				case 39: moveNextItem(e);
				break;

                // 아래 방향키
				case 40: moveNextItem(e);
                break;
            }

            function moveEndItem(e){
                $target = $sivItem.eq(num-1);
                focusItem();
            }

            function moveHomeItem(e){
                $target = $sivItem.eq(0);
                focusItem();
            }

            function movePrevItem(e){
                // 첫번 째 아이템이 아닐 때
                if (i > 0){
                    $target = $sivItem.eq(i-1);
                } else {
                    $target = $sivItem.eq(num-1);
                }
                focusItem();
            }
    
            function moveNextItem(e){
                // 마지막 아이템이 아닐 때
                if (i < num-1){
                    $target = $sivItem.eq(i+1);
                } else{
                    $target = $sivItem.eq(0);
                }
                focusItem();
            }

            function focusItem(){
                e.preventDefault();
                $target.children('.ui-acco-tit').children('.ui-acco-btn').focus();
            }
    
        };
        
        function initAcco(){
            var $onBtn = $tit.children('.ui-acco-btn.selected'),
                $onItem = $onBtn.closest($item),
                $onPnl = $onItem.children('.ui-acco-pnl');

            // 선택되지 않은 pnl 숨김
            $pnl.not($onPnl).hide();
        }

        initAcco();

        $btn.off('click.togglePnl, keydown.movePnl').
            on({'click.togglePnl': toggleItem,
            'keydown.movePnl': evtKeydown})

    };
    return function(opt){
        // 페이지 내 ui-acco 있을 때만 init
        if (!!$('.ui-acco').length){
            createAccordion(opt);
        } else return false;
    } 
})();