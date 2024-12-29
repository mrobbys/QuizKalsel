import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
    const [backgroundMusic, setBackgroundMusic] = useState(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(true); // Status musik (aktif atau tidak)
    const [musicPosition, setMusicPosition] = useState(0); // Menyimpan posisi musik terakhir

    useEffect(() => {
        // Memuat dan memutar musik latar ketika aplikasi dimulai
        const loadBackgroundMusic = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/panting.mp3'), // Path musik latar Anda
                { isLooping: true } // Musik berulang terus-menerus
            );
            setBackgroundMusic(sound);
            await sound.playAsync(); // Memulai musik latar
            await sound.setVolumeAsync(0.2); // Atur volume
        };

        loadBackgroundMusic();

        // Cleanup saat komponen di-unmount
        return () => {
            if (backgroundMusic) {
                backgroundMusic.stopAsync(); // Hentikan musik
                backgroundMusic.unloadAsync(); // Lepaskan sumber daya
            }
        };
    }, []); // Hanya dipanggil sekali saat aplikasi pertama kali dimuat

    // Fungsi untuk mem-pause musik dan menyimpan posisi terakhir
    const pauseMusic = async () => {
        if (backgroundMusic) {
            const status = await backgroundMusic.getStatusAsync();
            setMusicPosition(status.positionMillis); // Menyimpan posisi musik
            await backgroundMusic.pauseAsync(); // Pause musik
            setIsMusicPlaying(false); // Update status musik
        }
    };

    // Fungsi untuk melanjutkan musik dari posisi terakhir
    const resumeMusic = async () => {
        if (backgroundMusic) {
            await backgroundMusic.setPositionAsync(musicPosition); // Mulai dari posisi terakhir
            await backgroundMusic.playAsync(); // Mulai musik lagi
            setIsMusicPlaying(true); // Update status musik
        }
    };

    return (
        <MusicContext.Provider value={{ backgroundMusic, isMusicPlaying, pauseMusic, resumeMusic }}>
            {children}
        </MusicContext.Provider>
    );
};
