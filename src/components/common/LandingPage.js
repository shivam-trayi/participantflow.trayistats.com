import React, { useEffect, useState } from "react";

const LandingPage = ({ newTabURL, redirectURL }) => {
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const countdown = setInterval(() => {
            setSeconds((previousSeconds) => {
                if (previousSeconds <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return previousSeconds - 1;
            });
        }, 1000);

        const redirectTimer = setTimeout(() => {
            window.location.replace(redirectURL);
        }, 7000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirectTimer);
        };
    }, [redirectURL]);

    const handlePageClick = () => {
        const newWindow = window.open(
            newTabURL,
            "_blank",
            "noopener,noreferrer"
        );
        if (!newWindow) {
            console.error("Popup was blocked.");
        }
        window.location.replace(redirectURL);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[9999] animate-in fade-in duration-300" onClick={handlePageClick}>
            <div className="w-[520px] pt-[80px] bg-white rounded-[22px] p-[35px] text-center relative overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-350">
                <style>{`
                    .popup-glow::before {
                        content:''; position:absolute; width:220px; height:220px; background:#6f6dff; border-radius:50%; filter:blur(120px); opacity:0.18; top:-80px; right:-80px; pointer-events:none;
                    }
                    .popup-glow::after {
                        content:''; position:absolute; width:180px; height:180px; background:#00bfff; border-radius:50%; filter:blur(120px); opacity:0.15; bottom:-60px; left:-60px; pointer-events:none;
                    }
                    @keyframes giftBounce {
                        0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                        50% { transform: translate(-50%, -50%) translateY(-8px); }
                    }
                `}</style>
                <div className="popup-glow absolute inset-0 pointer-events-none rounded-[22px] overflow-hidden"></div>
                
                <div className="absolute top-0 left-1/2 w-[90px] h-[90px] bg-white rounded-full flex justify-center items-center text-[42px] shadow-[0_8px_25px_rgba(0,0,0,0.15)] z-10" style={{ transform: 'translate(-50%, -50%)', animation: 'giftBounce 2s ease-in-out infinite' }}>
                    ??
                </div>

                <h2 className="text-[38px] m-0 mb-2.5 font-bold relative z-10">Want to Earn More?</h2>
                <p className="text-[#666] text-[18px] m-0 mb-[30px] relative z-10">Unlock exciting rewards and offers</p>

                <div className="flex items-center justify-center gap-[18px] p-5 mb-[30px] border-2 border-[#f0f0f0] rounded-2xl bg-[#fafcff] relative z-10">
                    <span className="text-[42px]">??</span>
                    <div className="text-left">
                        <p className="m-0 text-[#666]">You will be redirected in</p>
                        <h3 className="m-0 mt-1.5 text-[34px] font-bold">
                            <span className="text-[#7a2cff]">{seconds}</span> seconds
                        </h3>
                    </div>
                </div>

                <div className="flex justify-center gap-5 relative z-10">
                    <button className="border-none py-[15px] px-[34px] rounded-xl cursor-pointer text-[17px] font-semibold bg-[#ececec] hover:bg-[#dadada] hover:-translate-y-0.5 transition-all text-slate-700">
                        ? Cancel
                    </button>
                    <button className="border-none py-[15px] px-[34px] rounded-xl cursor-pointer text-[17px] font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_10px_20px_rgba(22,119,255,0.35)] hover:shadow-[0_14px_28px_rgba(22,119,255,0.45)] hover:-translate-y-1 hover:scale-[1.03] transition-all">
                        ?? Earn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
