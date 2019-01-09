const socket = io('https://stream0109.herokuapp.com/');

$('#div_chat').hide();
socket.on('Danh_Sach_Online',arrUerInfo=>{
  $('#div_chat').show();
  $('#div_dang_ky').hide();
 arrUerInfo.forEach(user => {
   const {ten,peerId}= user;
   $('#ulUser').append('<li id='+user.peerId+'>'+user.ten+'</li>');
 });
 socket.on('Co_Nguoi_Dung_Moi',user=>{
  const {ten,peerId}= user;
  $('#ulUser').append('<li id='+user.peerId+'>'+user.ten+'</li>');
  });
  socket.on('Ai_Do_Ngat_Ket_Noi',peerId =>{
    $('#peerId').remove();
  });

});
socket.on('Dang_Ky_That_Bai',()=>alert(' Vui long chon username khac'));

function playStream (mediaStream,idvideoTag){
  var video = document.getElementById(idvideoTag);
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    video.play()
};
}; 

function openStream(){
  var constraints = {audio:true, video:true};
  return navigator.mediaDevices.getUserMedia(constraints)
  
 }

/* openStream()
.then(stream =>
  playStream(stream,'localStream')
  );
; */

// peer data conection 

var peer = new Peer();
peer.on('open',id=>{
  $('#myPeer').append(id);
  $('#btnSignUp').click(()=>{
    const   username = $("#txtUsername").val();
    socket.emit('Nguoi_dung_dang_ky',{ten:username,peerId:id});
  })

});

//Caller

$('#btnCall').click(function(){
  const id = $('#remote').val();
  openStream()
  .then(stream =>{
    playStream(stream,'localStream');
    const call = peer.call(id,stream);
    call.on('stream',remoteStream=>playStream(remoteStream,'remoteStream'));
  })
});
//Answer

peer.on('call',call=>{
  openStream()
  .then(stream=>{
    call.answer(stream);
    playStream(stream,'localStream');
    call.on('stream',remoteStream=>playStream(remoteStream,'remoteStream'));
  })
  
})
$("#ulUser").on('click','li',function(){
    const id = ($(this).attr('id'));
    /* console.log(id); */
    openStream()
    .then(stream =>{
       playStream(stream,'localStream');
       const call = peer.call(id,stream);
    call.on('stream',remoteStream => playStream(remoteStream,'remoteStream'));
  });
});

