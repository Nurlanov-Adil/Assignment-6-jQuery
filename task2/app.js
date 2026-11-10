/* Assignment 6 — jQuery only for DOM construction, events and effects. */
$(function () {
  'use strict';
  const MOTION = $('body').attr('data-task') === '2';
  let party = $.extend(true, [], originalParty);
  const symbols = { phone: '▣', glasses: '∞', bag: '▢', cup: '☕', crumbs: '△' };
  const labels = {phone:'a phone',glasses:'glasses',bag:'a bag',cup:'a cup',crumbs:'cake crumbs'};
  let finishLayout = null;
  let detailGuest = null;
  let detailTarget = null;
  let detailVersion = 0;

  function minutes(time) { const parts=time.split(':'); return +parts[0]*60 + +parts[1]; }
  function makeGuest(g) {
    // A guest name is a unique identity, including repeated Miras arrival cases.
    $('#guest-'+g.name).finish().remove();
    const $g=$('<article>', {
      id:'guest-'+g.name, class:'guest color-'+g.color+(g.aitu?' aitu':''),
      tabindex:0, role:'button', 'aria-label':'Open '+g.name,
      'data-name':g.name, 'data-color':g.color, 'data-time':g.time, 'data-minutes':minutes(g.time),
      'data-aitu':String(g.aitu), 'data-items':g.items.join(' '), 'data-order':g.order
    }).data('guest', $.extend(true,{},g));
    $.each(g.items, function(_,item){ $g.addClass('has-'+item); });
    $('<img>',{class:'avatar',src:'../assets/avatars/'+g.name+'.svg',alt:g.name+' avatar'}).appendTo($g);
    $('<span>',{class:'guest-name',text:g.name}).appendTo($g);
    $('<span>',{class:'time',text:g.time}).appendTo($g);
    const $things=$('<div>',{class:'things','aria-label':g.items.map(x=>labels[x]).join(', ')||'Nothing'}).appendTo($g);
    $.each(g.items,function(_,item){$('<span>',{class:'thing',title:item,text:symbols[item]}).appendTo($things);});
    if(g.aitu) $('<span>',{class:'badge',text:'AITU',title:'AITU student'}).appendTo($g);
    return $g;
  }
  function updateCounts() {
    $('.room').each(function(){ $(this).find('.count').text($(this).find('.guest').length+' guests'); });
  }
  // Finish an in-flight layout once, then handle the latest input against a stable DOM.
  function settle() {
    if(finishLayout) finishLayout();
    $('.guest').finish().css({top:0,left:0});
  }
  function hideDetailNow() {
    detailVersion++;
    $('#detail,#shade').stop(true,false).prop('hidden',true);
    detailGuest=null; detailTarget=null;
  }
  function buildParty() {
    settle(); hideDetailNow(); $('#house').empty();
    $.each([2,1],function(_,floor){
      const $floor=$('<section>',{class:'floor','data-floor':floor}).appendTo('#house');
      $('<div>',{class:'floor-label',text:'FLOOR 0'+floor}).appendTo($floor);
      const $rooms=$('<div>',{class:'rooms'}).appendTo($floor);
      $.each(party.filter(r=>r.floor===floor),function(_,room){
        const $room=$('<section>',{id:'room-'+room.id,class:'room','data-room':room.id,'data-name':room.name}).appendTo($rooms);
        const $head=$('<div>',{class:'room-head'}).appendTo($room);
        $('<h2>').text(room.name).append($('<span>',{class:'count'})).appendTo($head);
        if(MOTION) $('<button>',{class:'sort',text:'Sort by time','data-sorted':'false'}).appendTo($head);
        const $guests=$('<div>',{class:'guests'}).appendTo($room);
        $.each(room.guests,function(_,guest){makeGuest(guest).appendTo($guests);});
      });
    });
    updateCounts();
  }

  // Each case is one chain; it queries guest cards/rooms in the DOM, not party[].
  const cases = [
    {title:'Who is in the hall?', short:'In the hall', run:()=>$('#room-hall .guest')},
    {title:'Who is dressed in yellow or purple?',short:'Yellow or purple',run:()=>$('.guest.color-yellow, .guest.color-purple')},
    {title:'Which AITU students are upstairs?',short:'AITU upstairs',run:()=>$('.floor[data-floor="2"] .guest.aitu')},
    {title:'Who has glasses or a bag?',short:'Glasses or bag',run:()=>$('.guest.has-glasses, .guest.has-bag')},
    {title:'Who came with nothing at all?',short:'Nothing at all',run:()=>$('.guest[data-items=""]')},
    {title:'Who has a phone but no bag?',short:'Phone without bag',run:()=>$('.guest.has-phone:not(.has-bag)')},
    {title:'Who arrived between 20:30 and 21:00 inclusive?',short:'20:30 to 21:00',run:()=>$('.guest').filter(function(){return +$(this).attr('data-minutes')>=1230 && +$(this).attr('data-minutes')<=1260;})},
    {title:'Who arrived after 21:00 and is not an AITU student?',short:'Late nonstudents',run:()=>$('.guest:not(.aitu)').filter(function(){return +$(this).attr('data-minutes')>1260;})},
    {title:'Who stands right next to Askar?',short:'Next to Askar',run:()=>$('#guest-Askar').prev('.guest').add($('#guest-Askar').next('.guest'))},
    {title:'Who stands last in each room?',short:'Last in each room',run:()=>$('.guests > .guest:last-child')},
    {title:'Who stands third in each room?',short:'Third in each room',run:()=>$('.guests > .guest:nth-child(3)')},
    {title:'Who stands after Timur in his room?',short:'After Timur',run:()=>$('#guest-Timur').nextAll('.guest')},
    {title:'Who stands right before someone in black?',short:'Before black clothes',run:()=>$('.guest.color-black').prev('.guest')},
    {title:'In which room is Aruzhan?',short:'Find Aruzhan’s room',run:()=>$('#guest-Aruzhan').closest('.room')},
    {title:'Which rooms have fewer than 6 guests?',short:'Rooms under six',run:()=>$('.room').filter(function(){return $(this).find('.guest').length<6;})},
    {title:'Which rooms have a cup but no glasses?',short:'Cup without glasses',run:()=>$('.room:has(.guest.has-cup):not(:has(.guest.has-glasses))')},
    {title:'Who came first to each room?',short:'Earliest arrivals',run:()=>$('.guest').filter(function(){return !$(this).siblings('.guest').filter((_,g)=>+$(g).attr('data-minutes')<+$(this).attr('data-minutes')).length;})},
    {title:'Miras arrives between Askar and Inkar.',short:'Welcome Miras',run:()=>makeGuest({name:'Miras',color:'blue',time:'21:20',aitu:true,items:['phone'],order:+$('#guest-Askar').attr('data-order')+0.5}).hide().insertAfter('#guest-Askar').fadeIn(400)},
    {title:'Natasha says goodbye and goes home.',short:'Goodbye Natasha',run:()=>$('#guest-Natasha').animate({top:-12},130).animate({top:0},130).fadeOut(400,function(){$(this).remove();updateCounts();})},
    {title:'Who took the cake?',short:'Find the cake thief',run:()=>$('.floor[data-floor="1"] .guest.has-crumbs:not(.has-cup)').filter(function(){return +$(this).attr('data-minutes')>1260 && +$(this).attr('data-minutes')<1290;}).filter(function(){return $(this).prev('.guest').add($(this).next('.guest')).is('.aitu');})}
  ];
  function resultFor($found, number) {
    const names=$found.map(function(){return $(this).attr('data-name');}).get();
    $('#result').empty().append($('<b>',{text:'Case '+number+' · '+names.length+' found'}),$('<span>',{text:names.join(', ')||'No matches'}));
  }
  function clearSpotlight() {
    settle(); hideDetailNow(); $('.found').removeClass('found');
    $('.guest').stop(true,true).fadeTo(300,1);
    $('.case-button').removeClass('active');
    $('#result').html('<b>All guests visible</b><span>Choose another case to continue.</span>');
    $('#chain').text('Select a case to see its jQuery chain.');
  }
  function runCase(index) {
    buildParty();
    // Rebuild from current model before EVERY case. Moves are persistent, case edits are transient.
    $('.case-button').removeClass('active').eq(index).addClass('active');
    const entry=cases[index];
    const $found=entry.run().addClass('found');
    const $guests=$found.filter('.guest').add($found.filter('.room').find('.guest'));
    if(MOTION) $('.guest').not($guests).stop(true,true).fadeTo(300,0.2);
    // Fade for mutation cases must finish before the single jump starts.
    if(index!==18) $guests.promise().done(function(){
      $guests.filter(function(){return $.contains(document,this);}).animate({top:-12},130).animate({top:0},130);
    });
    $('#chain').text(entry.run.toString().replace(/^\(\)=>/,''));
    resultFor($found,index+1); updateCounts();
  }
  $.each(cases,function(i,c){
    $('<button>',{class:'case-button','data-case':i+1,title:c.title})
      .append($('<small>',{text:String(i+1).padStart(2,'0')}),$('<span>',{text:c.short})).appendTo('#cases');
  });
  $('#cases').on('click','.case-button',function(){runCase(+$(this).attr('data-case')-1);});
  $('#clear').on('click',clearSpotlight);
  $('#reset').on('click',function(){settle();party=$.extend(true,[],originalParty);buildParty();clearSpotlight();});
  buildParty();
  if(MOTION) {
    $('#hint').text('Click a guest for details. Esc closes the card.');
    function photoRect($guest) {
      const $photo=$guest.find('.avatar');
      const offset=$photo.offset();
      return {left:offset.left-$(window).scrollLeft(),top:offset.top-$(window).scrollTop(),width:$photo.outerWidth(),height:$photo.outerHeight()};
    }
    function closeDetail(after) {
      const token=++detailVersion;
      const target=detailTarget;
      $('#shade').stop(true,false).fadeTo(180,0,function(){if(token===detailVersion) $(this).prop('hidden',true);});
      const finish=function(){
        if(token!==detailVersion) return;
        $('#detail').prop('hidden',true); detailGuest=null; detailTarget=null;
        if(after) after();
      };
      if(!target || !$.contains(document,target[0])) {hideDetailNow();if(after) after();return;}
      $('#detail').stop(true,false).animate($.extend(photoRect(target),{opacity:0,padding:0}),220,finish);
    }
    function openDetail($guest) {
      settle();
      const token=++detailVersion;
      detailGuest=$guest.attr('data-name'); detailTarget=$guest;
      const g=$guest.data('guest'); const room=$guest.closest('.room').attr('data-room');
      const $card=$('#detail').stop(true,false).empty().prop('hidden',false);
      $('<button>',{class:'close',text:'×','aria-label':'Close card'}).appendTo($card);
      $guest.find('.avatar').clone().appendTo($card).css('border','3px solid '+$guest.css('--color'));
      $('<h2>',{text:g.name}).appendTo($card);
      $('<p>').text('Came at '+g.time+'. '+(g.aitu?'AITU student.':'Not an AITU student.')+' Wears '+g.color+'.').appendTo($card);
      let things='Came with nothing.';
      if(g.items.length) things='Has '+g.items.map(x=>labels[x]).join(', ').replace(/, ([^,]*)$/,' and $1')+'.';
      $('<p>',{text:things+' Currently in the '+$guest.closest('.room').attr('data-name').toLowerCase()+'.'}).appendTo($card);
      const $moves=$('<div>',{class:'move-buttons'}).appendTo($card);
      $.each(party,function(_,r){if(r.id!==room) $('<button>',{'data-move':r.id,text:'Move to the '+r.name.toLowerCase()}).appendTo($moves);});
      const width=Math.min(390,$(window).width()-28);
      $card.css({width:width,height:'auto',padding:24,opacity:1});
      const height=$card.outerHeight();
      const destination={width:width,height:height,padding:24,opacity:1,left:($(window).width()-width)/2,top:Math.max(12,($(window).height()-height)/2)};
      $card.css($.extend(photoRect($guest),{opacity:0,padding:0}));
      $('#shade').stop(true,false).prop('hidden',false).css('opacity',0).fadeTo(220,0.55);
      $card.animate(destination,260,function(){if(token===detailVersion) $(this).css('height','auto');});
    }
    function requestDetail($guest) {
      const name=$guest.attr('data-name');
      if(detailGuest===name) return;
      if(detailGuest) closeDetail(function(){openDetail($guest);});
      else openDetail($guest);
    }
    $('#house').on('click','.guest',function(){requestDetail($(this));});
    $('#house').on('keydown','.guest',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();requestDetail($(this));}});
    $('#detail').on('click','.close',function(){closeDetail();});
    $('#shade').on('click',function(){closeDetail();});
    $(document).on('keydown',function(e){if(e.key==='Escape') closeDetail();});
    $(window).on('resize',function(){settle();hideDetailNow();});

    function moveGuest(name,roomId) {
      settle(); hideDetailNow();
      const $guest=$('#guest-'+name), $from=$guest.closest('.room'), $to=$('#room-'+roomId);
      if(!$guest.length || $from.is($to)) return;
      const g=$.extend(true,{},$guest.data('guest'));
      const origin=$guest.offset(), width=$guest.outerWidth(), height=$guest.outerHeight();
      const $ghost=$guest.clone().removeAttr('id').removeClass('found').addClass('flying').css({left:origin.left-$(window).scrollLeft(),top:origin.top-$(window).scrollTop(),width:width,height:height,opacity:1}).appendTo('body');
      const $old=$('<div>',{class:'space'}).css('width',width).insertBefore($guest);
      $guest.detach();
      const $new=$('<div>',{class:'space'}).css('width',width).appendTo($to.find('.guests'));
      const target=$new.offset();
      $new.css('width',0);
      let done=false;
      const finish=function(){
        if(done) return; done=true; finishLayout=null;
        $ghost.add($old).add($new).stop(true,false);
        $old.remove(); $new.replaceWith($guest); $ghost.remove();
        $guest.css({opacity:1,top:0,left:0});
        const targetRoom=party.find(r=>r.id===roomId);
        g.order=Math.max(-1,...targetRoom.guests.map(x=>x.order))+1;
        $guest.attr('data-order',g.order).data('guest',g);
        $.each(party,function(_,r){r.guests=r.guests.filter(x=>x.name!==name);});
        targetRoom.guests.push(g);
        $from.add($to).find('.sort').attr('data-sorted','false').text('Sort by time');
        updateCounts();
        $('#result').empty().append($('<b>',{text:'Guest moved'}),$('<span>',{text:name+' is now at the end of the '+targetRoom.name.toLowerCase()+'.'}));
      };
      finishLayout=finish;
      $old.animate({width:0,opacity:0},480);
      $new.animate({width:width},480);
      $ghost.animate({left:target.left-$(window).scrollLeft(),top:target.top-$(window).scrollTop()},520,finish);
    }
    $('#detail').on('click','[data-move]',function(){moveGuest(detailGuest,$(this).attr('data-move'));});

    function sortRoom($button) {
      // Capture rendered positions before interrupting the previous sort.
      const $room=$button.closest('.room'),$container=$room.find('.guests');
      const visiblePositions=new Map();
      $container.children('.guest').each(function(){visiblePositions.set(this,$(this).offset());});
      settle(); hideDetailNow();
      const sorted=$button.attr('data-sorted')!=='true';
      $button.attr('data-sorted',String(sorted)).text(sorted?'Restore picture order':'Sort by time');
      const cards=$container.children('.guest').get(),before=new Map();
      $.each(cards,function(_,g){before.set(g,visiblePositions.get(g)||$(g).offset());});
      cards.sort(function(a,b){return +$(a).attr(sorted?'data-minutes':'data-order')-+$(b).attr(sorted?'data-minutes':'data-order');});
      $.each(cards,function(_,g){$container.append(g);});
      let done=false;
      const finish=function(){
        if(done) return;done=true;finishLayout=null;
        $(cards).stop(true,false).css({top:0,left:0,zIndex:''});
      };
      finishLayout=finish;
      let remaining=cards.length;
      $.each(cards,function(_,g){
        const $g=$(g),old=before.get(g),next=$g.offset();
        $g.css({left:old.left-next.left,top:old.top-next.top,zIndex:2})
          .animate({left:0,top:0},420,function(){if(--remaining===0) finish();});
      });
      $('#result').empty().append($('<b>',{text:sorted?'Sorted by arrival':'Picture order restored'}),$('<span>',{text:$room.attr('data-name')+' · '+cards.map(g=>$(g).attr('data-time')).join(', ')}));
    }
    $('#house').on('click','.sort',function(){sortRoom($(this));});
  }

});
