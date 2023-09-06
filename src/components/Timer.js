import { useState, useEffect } from "react";

const Timer = ({ isPlaying }) => {

    const [songTime, setSongTime] = useState(['', '', '', '']);

    useEffect(() => {
        if (isPlaying != null) {
            const timer = setInterval(function () {
                if (!isNaN(isPlaying.duration)) {
                    let minTime, remainingTime;
                    let curTime = Math.ceil(isPlaying.currentTime);
                    let duration = Math.floor(isPlaying.duration);
                    if (curTime > 59) {
                        if ((curTime % 60) < 10) {
                            minTime = Math.floor((curTime / 60)) + ':0' + (curTime % 60)
                        } else {
                            minTime = Math.floor((curTime / 60)) + ':' + (curTime % 60)
                        }
                    } else {
                        if (curTime < 10) {
                            minTime = '0:0' + curTime
                        } else {
                            minTime = '0:' + curTime
                        }
                    }
                    remainingTime = duration - curTime;
                    if (remainingTime > 59) {
                        if ((remainingTime % 60) < 10) {
                            remainingTime = Math.floor(remainingTime / 60) + ':0' + (remainingTime % 60)
                        } else {
                            remainingTime = Math.floor(remainingTime / 60) + ':' + (remainingTime % 60)
                        }
                    } else {
                        if (remainingTime < 10) {
                            remainingTime = '0:0' + remainingTime
                        } else {
                            remainingTime = '0:' + remainingTime
                        }
                    }
                    setSongTime([duration, curTime, minTime, remainingTime]);
                }
            }, 250);
            return () => clearInterval(timer);
        }
    }, [isPlaying])

    return (
        <div className="song-tracker">
            {songTime[2] !== '' && songTime[0] > songTime[1] && isPlaying != null &&
                <>
                    <span className="current-time">{songTime[2]}</span>
                    <div className="tracker-bar">
                        <div className="tracker-cur" style={{ width: ((songTime[1] / songTime[0]) * 100) + '%' }}></div >
                    </div>
                    <span className="remaining-time">{songTime[3]}</span>
                </>
            }
        </div>
    )
}

export default Timer