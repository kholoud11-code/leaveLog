import React from 'react';
import VideoPlayer from 'react-video-js-player'
import img from '../../assets/video/nttdata.png'
import video from '../../assets/video/Video.mp4'


const VideoPlayerNtt = () => {
 
    const videoSrc = video //"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    const poster = img 

    return(
            <VideoPlayer 
                src={videoSrc} 
                poster={poster}
                width='1095'
                height='600'
                playbackRates={[0.5, 1, 1.5, 2, 5]}/>
    )
}
export default VideoPlayerNtt