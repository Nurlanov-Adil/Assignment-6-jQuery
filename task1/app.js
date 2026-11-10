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

});
