import React, { useEffect, useRef, useState } from 'react';
import { textToSpeech } from '~/api/textToSpeech';
import ShowNostis from '~/common/utils/show-noti';

const TextToSpeech: React.FC<{ text: string }> = ({ text }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState('');


    useEffect(() => {
        getaudioSrc(text)
    }, [text])
    const getaudioSrc = async (_text)=>
    {
        try {
            if (_text) {
                let res = await textToSpeech.convertTextToSpeech({ TypeVoice: 1, Content: _text })
                if (res.status == 200) {
                    setAudioSrc(res.data.data)
                }
            }
        } catch (error) {
            ShowNostis.error(error?.message)
        }
    }
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    return (
        <div className="container ">
            <div className="col-md-6">
                <audio ref={audioRef} src={audioSrc} />
                <div className="mt-3 ">
                    <button className="btn btn-primary mx-2 w10" onClick={playAudio}>
                        Play
                    </button>
                    <button className="btn btn-primary mx-2 w100 mt-1" onClick={pauseAudio}>
                        Pause
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;

