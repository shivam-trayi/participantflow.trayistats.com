import { useEffect, useState, useRef } from 'react';
import { getUrlParam } from "../../utils/urlUtils";
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import "../../styles/animations.css";

const SuccessPage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector((state) => state.alert);
    const loading = useSelector((state) => state.spinner.loading);
    const canvasRef = useRef(null);

    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);
    let allRequestData = requestData(window);

    let c1Search = getUrlParam('rid', 'Empty');
    let c2Search = getUrlParam('pid', 'Empty');
    let c3Search = getUrlParam('memberId', 'Empty');

    useEffect(() => {
        if (!alertMessage?.message && allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: "You are hitting a bad url." }))
        }
    }, [alertMessage, allRequestData.badUrlHitting, dispatch]);

    // Call the Create Participant API
    useEffect(() => {
        if (!updateParticipantFromClient && !allRequestData.badUrlHitting) {
            let allQueryParams = allRequestData.urlQueryString;
            let landingURL = allRequestData.landingURL;
            setUpdateParticipantFromClient(true);

            dispatch(startSpinner());

            dispatch(updateParticipantFromClientAction(allQueryParams, landingURL, 1))
                .then((result) => {
                    dispatch(endSpinner());

                    if (result.type === "MESSAGE") {
                        dispatch(setMessage({ success: result.success, message: result.message }));
                    } else if (result.type === "REDIRECT") {
                        window.location.href = result.redirectURL;
                    }
                })
                .catch((error) => {
                    dispatch(endSpinner());
                    dispatch(setMessage({ success: false, message: error.message || "An error occurred" }));
                });
        }
    }, [updateParticipantFromClient, allRequestData.badUrlHitting, allRequestData.urlQueryString, allRequestData.landingURL, dispatch])

    // Canvas & Celebration Logic Effect
    useEffect(() => {
        // Audio Chime Logic
        let audioCtx = null;
        function playGentleVictoryChime() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                if (!audioCtx) audioCtx = new AudioContext();

                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

                const frequencies = [523.25, 659.25, 783.99, 1046.50];
                const now = audioCtx.currentTime;

                frequencies.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                    gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.65);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);

                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.7);
                });
            } catch (e) { console.warn('Audio play prevented', e); }
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStardust();
        };
        window.addEventListener('resize', handleResize);

        const colors = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#38BDF8'];
        const particles = [];
        const ambientStardust = [];
        const MAX_AMBIENT = 24;

        function initStardust() {
            ambientStardust.length = 0;
            for (let i = 0; i < MAX_AMBIENT; i++) {
                ambientStardust.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2.5 + 1.2,
                    speedY: Math.random() * 0.45 + 0.25,
                    speedX: (Math.random() - 0.5) * 0.35,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.55 + 0.25,
                    glow: Math.random() * 8 + 4,
                    pulseSpeed: 0.02 + Math.random() * 0.025,
                    pulseOffset: Math.random() * Math.PI * 2
                });
            }
        }
        initStardust();

        function createBurst(originX, originY, count, intensity = 1) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = (3 + Math.random() * 6.5) * intensity;
                const shapeType = Math.random() > 0.4 ? 'diamond' : (Math.random() > 0.5 ? 'ribbon' : 'star');

                particles.push({
                    x: originX,
                    y: originY,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity - (2.5 * intensity),
                    size: Math.random() * 5.5 + 3.5,
                    aspect: shapeType === 'ribbon' ? 2.2 : 1,
                    shape: shapeType,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 9,
                    opacity: 1,
                    decay: 0.007 + Math.random() * 0.008,
                    gravity: 0.13,
                    wobble: Math.random() * 10,
                    wobbleSpeed: 0.08 + Math.random() * 0.05
                });
            }
            if (!isRendering) {
                startRenderLoop();
            }
        }

        let isRendering = false;
        let animationFrame;

        function render(time) {
            ctx.clearRect(0, 0, width, height);
            const t = time * 0.001 || 0;

            for (let j = 0; j < ambientStardust.length; j++) {
                const dust = ambientStardust[j];
                dust.y -= dust.speedY;
                dust.x += dust.speedX + Math.sin(t + j) * 0.2;

                if (dust.y < -10) {
                    dust.y = height + 10;
                    dust.x = Math.random() * width;
                }
                if (dust.x < -10) dust.x = width + 10;
                if (dust.x > width + 10) dust.x = -10;

                const currentAlpha = dust.alpha * (0.6 + 0.4 * Math.sin(t * dust.pulseSpeed * 60 + dust.pulseOffset));

                ctx.save();
                ctx.beginPath();
                ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
                ctx.fillStyle = dust.color;
                ctx.globalAlpha = Math.max(0.1, currentAlpha);
                ctx.shadowBlur = dust.glow;
                ctx.shadowColor = dust.color;
                ctx.fill();
                ctx.restore();
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.opacity > 0) {
                    p.x += p.vx + Math.sin(p.wobble) * 0.6;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.vx *= 0.982;
                    p.rotation += p.rotationSpeed;
                    p.wobble += p.wobbleSpeed;
                    p.opacity -= p.decay;

                    if (p.opacity < 0) p.opacity = 0;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(0, p.opacity);

                    if (p.shape === 'star') {
                        ctx.beginPath();
                        for (let s = 0; s < 4; s++) {
                            ctx.rotate(Math.PI / 2);
                            ctx.lineTo(p.size, 0);
                            ctx.lineTo(p.size * 0.3, p.size * 0.3);
                        }
                        ctx.fill();
                    } else if (p.shape === 'ribbon') {
                        ctx.fillRect(-p.size / 2, (-p.size * p.aspect) / 2, p.size, p.size * p.aspect);
                    } else {
                        ctx.rotate(Math.PI / 4);
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    }
                    ctx.restore();
                }
            }
            animationFrame = requestAnimationFrame(render);
        }

        function startRenderLoop() {
            if (!isRendering) {
                isRendering = true;
                animationFrame = requestAnimationFrame(render);
            }
        }
        startRenderLoop();

        let burstTimeout1 = setTimeout(() => {
            const cx = width / 2;
            const cy = height / 2 - 50;
            createBurst(cx, cy, 48, 1);
            playGentleVictoryChime();

            setTimeout(() => {
                createBurst(cx - 70, cy - 20, 24, 0.85);
                createBurst(cx + 70, cy - 20, 24, 0.85);
            }, 320);
        }, 350);

        const handlePointerDown = (e) => {
            createBurst(e.clientX, e.clientY, 18, 0.9);
            playGentleVictoryChime();
        };
        window.addEventListener('pointerdown', handlePointerDown);

        const popper = document.getElementById('popperIcon');
        const handlePopperClick = (e) => {
            e.stopPropagation();
            if (popper) {
                const rect = popper.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45, 1.25);
                playGentleVictoryChime();
            }
        };
        if (popper) {
            popper.addEventListener('click', handlePopperClick);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointerdown', handlePointerDown);
            if (popper) popper.removeEventListener('click', handlePopperClick);
            cancelAnimationFrame(animationFrame);
            clearTimeout(burstTimeout1);
        };
    }, []);

    const isHiddenRoute = (
        c1Search.startsWith("SS") || c2Search.startsWith("SS") ||
        c1Search.startsWith("NBL") ||
        c3Search.startsWith("NBL") ||
        c2Search.startsWith("NBL")
    );

    if (isHiddenRoute) {
        return <div></div>;
    }

    return (
        <div className="h-screen w-full font-sans antialiased text-slate-800 bg-[#f8faff] transition-colors duration-500 select-none overflow-x-hidden cursor-default" style={{ fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif' }}>


            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 -left-40 w-[42rem] h-[42rem] sm:w-[58rem] sm:h-[58rem] rounded-full bg-gradient-to-br from-indigo-300/45 via-purple-200/30 to-transparent blur-3xl transition-all duration-700"></div>
                <div className="absolute -bottom-40 -right-40 w-[44rem] h-[44rem] sm:w-[60rem] sm:h-[60rem] rounded-full bg-gradient-to-tl from-emerald-200/45 via-teal-200/30 to-transparent blur-3xl transition-all duration-700"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-gradient-to-r from-purple-200/25 via-sky-200/30 to-teal-200/25 blur-3xl"></div>
                <div className="achievement-sunburst"></div>
                <canvas ref={canvasRef} id="confettiCanvas" className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
            </div>

            <main className="relative z-10 min-h-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <section className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
                    <div className="relative mb-8 sm:mb-9 flex items-center justify-center">
                        <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-indigo-400/40 animate-ripple pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-400/40 animate-ripple-delayed pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-indigo-500/30 via-cyan-400/30 to-emerald-400/30 blur-2xl animate-glow-halo pointer-events-none" aria-hidden="true"></div>

                        <div className="absolute -top-3 -left-12 sm:-left-16 w-2.5 h-2.5 bg-[#06B6D4] opacity-90 rotate-45 rounded-[1.5px] shadow-sm animate-float-1 pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute -top-6 right-4 sm:right-8 w-2.5 h-2.5 bg-[#F43F5E] opacity-85 rotate-12 rounded-[1.5px] shadow-sm animate-float-2 pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute top-1/2 -left-16 sm:-left-20 w-3 h-3 bg-[#F59E0B] opacity-90 rotate-45 rounded-[1.5px] shadow-sm animate-float-2 pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute bottom-1 -left-10 sm:-left-12 w-2 h-2 bg-[#38BDF8] opacity-90 rotate-12 rounded-[1.5px] shadow-sm animate-float-1 pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute -bottom-6 -left-20 sm:-left-24 w-2.5 h-2.5 bg-[#8B5CF6] opacity-85 rotate-45 rounded-[1.5px] shadow-sm animate-float-2 pointer-events-none" aria-hidden="true"></div>
                        <div className="absolute bottom-2 -right-12 sm:-right-16 w-2.5 h-2.5 bg-[#10B981] opacity-85 rotate-45 rounded-[1.5px] shadow-sm animate-float-1 pointer-events-none" aria-hidden="true"></div>

                        <div className="absolute -top-7 -left-5 text-amber-400 text-xs animate-twinkle pointer-events-none" aria-hidden="true">?</div>
                        <div className="absolute -bottom-4 right-1 text-cyan-400 text-xs animate-twinkle pointer-events-none" style={{ animationDelay: '1.4s' }} aria-hidden="true">?</div>

                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3.5px] gradient-ring-border shadow-2xl shadow-indigo-500/25 animate-badge-entrance animate-achievement-pulse transition-transform duration-300 hover:scale-105">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center backdrop-blur-md transition-colors duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/45 to-white/0 pointer-events-none"></div>

                                {loading ? (
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin relative z-10"></div>
                                ) : (
                                    <svg className="w-11 h-11 sm:w-[52px] sm:h-[52px] relative z-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="checkGradient" x1="12" y1="24" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                                                <stop offset="0%" stopColor="#7C3AED" />
                                                <stop offset="40%" stopColor="#4F46E5" />
                                                <stop offset="75%" stopColor="#06B6D4" />
                                                <stop offset="100%" stopColor="#10B981" />
                                            </linearGradient>
                                        </defs>
                                        <path className="animate-check" d="M13.5 24.5L21 32L34.5 16.5" stroke="url(#checkGradient)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    <h1 className="animate-fade-1 text-4xl sm:text-5xl md:text-[3.6rem] font-extrabold tracking-tight mb-3 sm:mb-4 pb-1 select-none inline-flex items-center justify-center gap-2 sm:gap-3 flex-wrap drop-shadow-sm leading-tight">
                        <span id="popperIcon" className="animate-popper text-3xl sm:text-4xl md:text-5xl select-none transition-transform hover:scale-125 cursor-pointer" title="Tap to celebrate!" aria-hidden="true">🎉</span>
                        <span className="shimmer-gradient-text">Congratulations!</span>
                    </h1>

                    <h2 className="animate-fade-2 text-lg sm:text-xl md:text-2xl font-bold text-slate-700 tracking-normal mb-3">
                        Survey Completed Successfully
                    </h2>

                    <p className="animate-fade-3 text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-md mx-auto mb-8 sm:mb-9 px-3">
                        Thank you for completing the survey. Your opinion helps shape the world around you.
                    </p>

                    <aside className="animate-fade-4 w-full max-w-md mx-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-sm shadow-amber-500/5 backdrop-blur-md transition-all" role="alert" aria-live="polite">
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 shadow-sm">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-amber-800 tracking-normal text-left sm:text-center">
                            Please do not close this window or refresh the page
                        </span>
                    </aside>
                </section>
            </main>
        </div>
    )
}



export default SuccessPage;
