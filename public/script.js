


const socket=io('/')
const videoGrid=document.getElementById('video-grid')
const videoToggle=document.getElementById('video-button')

let videoTracks;
const myPeer= new Peer(undefined,{
    host:'/',
    port:'3001'

})


const myVideo=document.createElement('video');
myVideo.muted=true;
const peers={}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream)
     videoTracks = stream.getVideoTracks();
    myPeer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream)
    })
})


// videoToggle.addEventListener('click',()=>{
//     console.log(videoTracks);
//     if( videoTracks[0].enabled){
//         videoTracks[0].enabled = false;
       
//     }
//     else{
        
//         videoTracks[0].enabled = true;
//     }

// })

socket.on('user-disconnected',userId=>{
    if(peers[userId]){
        console.log(peers[userId])
    peers[userId].close();
    }
})
myPeer.on('open',id => {
    socket.emit('join-room',ROOM_ID,id)

})

const connectToNewUser=(userId,stream)=>{
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove();
    })
    peers[userId]=call

}



const addVideoStream=(video,stream)=>{
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)

}